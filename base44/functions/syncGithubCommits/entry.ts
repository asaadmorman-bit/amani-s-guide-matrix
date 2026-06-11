import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { owner, repo, branch = 'main' } = body;

    if (!owner || !repo) {
      return Response.json({ error: 'owner and repo are required' }, { status: 400 });
    }

    const GITHUB_TOKEN = Deno.env.get('GITHUB_TOKEN');
    const headers = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(GITHUB_TOKEN ? { 'Authorization': `Bearer ${GITHUB_TOKEN}` } : {})
    };

    // Fetch recent commits from GitHub
    const commitsRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}&per_page=10`,
      { headers }
    );

    if (!commitsRes.ok) {
      const err = await commitsRes.text();
      return Response.json({ error: `GitHub API error: ${err}` }, { status: commitsRes.status });
    }

    const commits = await commitsRes.json();

    // Get active workflows to attach commits to
    const workflows = await base44.entities.Workflow.list('-updated_date', 10);
    const activeWorkflow = workflows.find(w => w.is_active) || workflows[0];

    if (!activeWorkflow) {
      return Response.json({ error: 'No workflows found. Create a workflow first.' }, { status: 404 });
    }

    // Sync each commit as a WorkflowLog entry in the governance engine
    const syncedLogs = [];
    for (const commit of commits) {
      const sha = commit.sha?.slice(0, 7);
      const message = commit.commit?.message?.split('\n')[0] || 'No message';
      const author = commit.commit?.author?.name || 'Unknown';
      const committedAt = commit.commit?.author?.date || new Date().toISOString();

      const log = await base44.entities.WorkflowLog.create({
        workflow_id: activeWorkflow.id,
        status: 'success',
        triggered_at: committedAt,
        duration_ms: 0,
        message: `[${sha}] ${message} — by ${author}`,
        trigger_source: `github:${owner}/${repo}@${branch}`
      });

      syncedLogs.push({ sha, message, author, log_id: log.id });
    }

    return Response.json({
      synced: syncedLogs.length,
      workflow: activeWorkflow.title,
      commits: syncedLogs,
      repo: `${owner}/${repo}`,
      branch
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
import * as core from '@actions/core'
import * as github from '@actions/github'
import * as axios from 'axios'
import {Template} from 'adaptivecards-templating'
import {templateData} from './templateData'
import {Conclusions, StepStatus, TextBlockColor} from './types'

async function sleep(ms: number): Promise<unknown> {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

const send = async () => {
  await sleep(5000)
  const token = core.getInput('github-token')
  const webhookUri = core.getInput('webhook-uri')
  const o = github.getOctokit(token)
  const ctx = github.context
  const jobList = await o.actions.listJobsForWorkflowRun({
    repo: ctx.repo.repo,
    owner: ctx.repo.owner,
    run_id: ctx.runId
  })

  const jobs = jobList.data.jobs

  const job = jobs.find(j => j.name.startsWith(ctx.job))

  const stoppedStep = job?.steps.find(
    s =>
      s.conclusion === Conclusions.FAILURE ||
      s.conclusion === Conclusions.TIMED_OUT ||
      s.conclusion === Conclusions.TIMED_OUT ||
      s.conclusion === Conclusions.ACTION_REQUIRED
  )
  const lastStep = stoppedStep
    ? stoppedStep
    : job?.steps.reverse().find(s => s.status === StepStatus.COMPLETED)

  const wr = await o.actions.getWorkflowRun({
    owner: ctx.repo.owner,
    repo: ctx.repo.repo,
    run_id: ctx.runId
  })

  const pr = await o.pulls.get({
    owner: ctx.repo.owner,
    repo: ctx.repo.repo,
    pull_number: ctx.payload.pull_request?.number || 0
  })

  const full_commit_message = wr.data.head_commit.message || ''
  const commit_message = full_commit_message.split('\n')[0]

  const isCancelledOrFailed =
    lastStep?.conclusion === Conclusions.CANCELLED ? 'CANCELLED' : 'FAILED'

  const isWarringOrAttention =
    lastStep?.conclusion === Conclusions.CANCELLED
      ? TextBlockColor.Warning
      : TextBlockColor.Attention

  const conclusion =
    lastStep?.conclusion === Conclusions.SUCCESS
      ? 'SUCCEEDED'
      : isCancelledOrFailed

  const conclusion_color =
    lastStep?.conclusion === Conclusions.SUCCESS
      ? TextBlockColor.Good
      : isWarringOrAttention

  const rawdata = JSON.stringify(templateData)
  const template = new Template(rawdata)
  const content = template.expand({
    $root: {
      repository: {
        name: ctx.payload.repository?.full_name,
        html_url: ctx.payload.repository?.html_url
      },
      commit: {
        message: commit_message,
        html_url: `${wr.data.repository.html_url}/commit/${wr.data.head_sha}`
      },
      workflow: {
        name: ctx.workflow,
        conclusion,
        conclusion_color,
        run_number: ctx.runNumber,
        run_html_url: wr.data.html_url
      },
      event: {
        type: ctx.eventName === 'pull_request' ? 'Pull request' : 'Branch',
        html_url:
          ctx.eventName === 'pull_request'
            ? ctx.payload.pull_request?.html_url
            : `${ctx.payload.repository?.html_url}/tree/${ctx.ref}`
      },
      author: {
        username: ctx.payload.sender?.login,
        html_url: ctx.payload.sender?.html_url,
        avatar_url: ctx.payload.sender?.avatar_url
      },
      pr: {
        title: pr.data.title
      },
      pr_author: {
        username: pr.data.assignee?.login,
        avatar_url: pr.data.assignee?.avatar_url,
        html_url: pr.data.assignee?.html_url
      }
    }
  })

  const webhookBody = {
    type: 'message',
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: JSON.parse(content)
      }
    ]
  }

  core.info(JSON.stringify(webhookBody))

  const response = await axios.default.post(webhookUri, webhookBody)
  core.info(JSON.stringify(response.data))
}

async function run() {
  try {
    await send()
  } catch (error) {
    core.error(error)
    core.setFailed(error.message)
  }
}

run()

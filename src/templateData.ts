const templateData = {
  type: 'AdaptiveCard',
  body: [
    {
      type: 'TextBlock',
      size: 'Large',
      weight: 'Bolder',
      text:
        "Workflow '${$root.workflow.name}' #${$root.workflow.run_number} ${$root.workflow.conclusion}",
      color: '${$root.workflow.conclusion_color}',
      fontType: 'Default',
      separator: true
    },
    {
      type: 'TextBlock',
      text: 'on [${$root.repository.name}](${$root.repository.html_url})',
      wrap: true,
      spacing: 'None'
    },
    {
      type: 'Container'
    },
    {
      type: 'TextBlock',
      text: '${$root.pr.title}',
      wrap: true,
      spacing: 'Medium',
      size: 'Large'
    },
    {
      type: 'TextBlock',
      text: 'Create PR user',
      wrap: true,
      spacing: 'None'
    },
    {
      type: 'ColumnSet',
      columns: [
        {
          type: 'Column',
          items: [
            {
              type: 'Image',
              style: 'Person',
              url: '${$root.author.avatar_url}',
              size: 'Medium'
            }
          ],
          width: 'auto'
        },
        {
          type: 'Column',
          items: [
            {
              type: 'TextBlock',
              weight: 'Bolder',
              text: '[${$root.author.username}](${$root.author.html_url})',
              wrap: true
            }
          ],
          width: 'stretch'
        }
      ],
      spacing: 'Medium'
    },
    {
      type: 'TextBlock',
      text: 'Assignee user',
      wrap: true,
      spacing: 'None'
    },
    {
      type: 'ColumnSet',
      columns: [
        {
          type: 'Column',
          items: [
            {
              type: 'Image',
              style: 'Person',
              url: '${$root.pr_author.avatar_url}',
              size: 'Medium'
            }
          ],
          width: 'auto'
        },
        {
          type: 'Column',
          items: [
            {
              type: 'TextBlock',
              weight: 'Bolder',
              text:
                '[${$root.pr_author.username}](${$root.pr_author.html_url})',
              wrap: true
            }
          ],
          width: 'stretch'
        }
      ]
    },
    {
      type: 'FactSet',
      facts: [
        {
          title: 'Commit',
          value: '[${$root.commit.message}](${$root.commit.html_url})'
        },
        {
          title: '${$root.event.type}',
          value: '[${$root.event.html_url}](${$root.event.html_url})'
        },
        {
          title: 'Workflow run details',
          value:
            '[${$root.workflow.run_html_url}](${$root.workflow.run_html_url})'
        }
      ],
      height: 'stretch',
      separator: true,
      spacing: 'Medium'
    }
  ],
  $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
  version: '1.2'
}

export {templateData}

import marked from 'marked'
import fs from 'fs'
import npmRun from 'npm-run'
;(async () => {
  await generateIndexes()
  configMarked()
  const contents = fs.readFileSync('./README.md')
  fs.writeFileSync('./index.html', template(marked(contents.toString())))
})()

function template(content: string) {
  return `
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href="https://fonts.googleapis.com/css?family=Markazi+Text" rel="stylesheet">
    <title>Talks</title>
    <style>
        html {
          display: flex;
          justify-content: center;
        }
        
        body {
          font-family: 'Markazi Text', serif;
          font-size: 15px;
          max-width: 800px;
          color: #616161;
          letter-spacing: 0.5px;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        p, ul, li, a {
          font-size: 27px;
        }
        
        
        a {
          color: black;
          text-underline-position: under;
        }
        
        h1, h2, h3, h4, h5, h6 {
          margin: 2.75rem 0 1rem;
          color: #3a3a3a;
          font-family: sans-serif;
          font-weight: 400;
          line-height: 1.15;
        }
        
        h1 {
          margin-top: 0;
          font-size: 3.052em;
        }
        
        h2 {
          font-size: 2.441em;
        }
        
        h3 {
          font-size: 1.953em;
        }
        
        h4 {
          font-size: 1.563em;
        }
        
        h5 {
          font-size: 1.25em;
        }
        
        strong {
          letter-spacing: 1.3px;
          color: #3a3a3a;
        }
    </style>
</head>
<body>
    ${content}
</body>
</html>
`
}

function generateIndexes() {
  return new Promise(resolve => {
    npmRun.exec('./node_modules/.bin/doctoc --title "## Index" README.md', () => {
      resolve()
    })
  })
}

function generateAnchors(renderer: marked.Renderer) {
  renderer.heading = (text, level) => {
    const escapedText = encodeURIComponent(text.toLowerCase()).replace(/%20/g, '-')

    return `
          <h${level}>
          <a name="${escapedText}" href="#${escapedText}"></a>
          ${text}
          </h${level}>`
  }
}

function configMarked() {
  const myRenderer = new marked.Renderer()

  generateAnchors(myRenderer)

  myRenderer.link = (href, title, text) => {
    const external = /^https?:\/\/.+$/.test(href)
    const newWindow = external || title === 'newWindow'
    let out = `<a href="${href}"`

    if (newWindow) {
      out += ` target="_blank"`
    }

    if (title && title !== 'newWindow') {
      out += ` title="${title}"`
    }

    return (out += `>${text}</a>`)
  }

  marked.setOptions({ renderer: myRenderer })
}

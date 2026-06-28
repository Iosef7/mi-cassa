const fs = require('fs');
const cheerio = require('cheerio');

// Read the content.md file
const filePath = 'C:\\Users\\iosef\\.gemini\\antigravity-ide\\brain\\9947d1bd-b81d-45a3-9872-dcf0caf56117\\.system_generated\\steps\\58\\content.md';
const content = fs.readFileSync(filePath, 'utf8');

// Load HTML
const $ = cheerio.load(content);

// Remove scripts and styles
$('script, style, link').remove();

// Extract headings, paragraphs, and images
const elements = [];
$('h1, h2, h3, h4, p, img, a.et_pb_button').each((i, el) => {
  const tagName = el.tagName.toLowerCase();
  
  if (tagName === 'img') {
    elements.push({ type: tagName, src: $(el).attr('src'), alt: $(el).attr('alt') });
  } else if (tagName === 'a') {
    elements.push({ type: 'button', text: $(el).text().trim(), href: $(el).attr('href') });
  } else {
    const text = $(el).text().trim();
    if (text) {
      elements.push({ type: tagName, text });
    }
  }
});

// Output
console.log(JSON.stringify(elements, null, 2));

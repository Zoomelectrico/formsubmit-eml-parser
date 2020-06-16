const fs = require('fs');
const util = require('util');
const emlFormat = require('eml-format');
const regex =  /\b([^\s]+@[^\s]+)\b/g;

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const emlRead = util.promisify(emlFormat.read);

async function main() {
  try {
    /**
     * @type Array<string>
     */
    let emails = [];
    const filesNames = await readdir('./files', 'utf-8')
    for (file of filesNames) {
      const emlFile = await readFile(`./files/${file}`);
      const data = await emlRead(emlFile.toString());
      if (data && data.text) {
        /**
         * @type string
         */
        const text = data.text;
        emails.push(...text.match(regex));
      }
    }
    emails = emails
      .filter(email => email !== 'submissions@formsubmit.co')
      .map(email => `\n${email}`);
    await writeFile('emails.text', emails)
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();

const fs = require('fs');
const path = require('path');

const root = 'd:\\Class 12\\Youthfest 2026';

function removeDifficulty() {
  const file = path.join(root, 'src', 'app', 'admin', 'page.tsx');
  let content = fs.readFileSync(file, 'utf8');

  // Remove table header
  content = content.replace(
    '<th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-xs">Difficulty</th>\n',
    ''
  );

  // Remove table cell (td containing difficulty span)
  // We need to carefully remove the block from <td className="px-6 py-4"> up to </td> for difficulty
  // Since it's multi-line, let's use regex or string replace.
  const tdDifficultyBlock = ` <td className="px-6 py-4">\n <span className={\`text-[10px] uppercase font-bold px-2 py-1 rounded-full border \${event.difficulty === 'Easy' ? 'border-green-500/30 text-green-400 bg-green-500/10' : event.difficulty === 'Medium' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' : 'border-red-500/30 text-red-400 bg-red-500/10'}\`}>\n {event.difficulty}\n </span>\n </td>\n`;
  content = content.replace(tdDifficultyBlock, '');

  // Remove form select for difficulty
  const selectBlock = ` <div>\n <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Difficulty</label>\n <select name="difficulty" defaultValue={editingEvent?.difficulty || 'Easy'} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white">\n <option value="Easy">Easy</option>\n <option value="Medium">Medium</option>\n <option value="Hard">Hard</option>\n </select>\n </div>\n`;
  content = content.replace(selectBlock, '');

  fs.writeFileSync(file, content);
  console.log('Removed Difficulty from UI');
}

try {
  removeDifficulty();
} catch (e) {
  console.error(e);
}


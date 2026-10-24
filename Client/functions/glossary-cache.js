const fs = require('node:fs/promises');
const path = require('node:path');

const CACHE_PATH = 'glossaryCache';
const RULES_SOURCE_PATH = path.resolve(__dirname, '../src/assets/rules.json');

function isRule(rule) {
  return rule && typeof rule === 'object' &&
    typeof rule.id === 'string' && rule.id &&
    typeof rule.name === 'string' && rule.name &&
    typeof rule.rule === 'string' &&
    Array.isArray(rule.keywords) && rule.keywords.every(keyword => typeof keyword === 'string');
}

async function readRulesFromDisk({sourcePath = RULES_SOURCE_PATH} = {}) {
  const raw = await fs.readFile(sourcePath, 'utf8');
  const rules = JSON.parse(raw);
  if (!Array.isArray(rules) || rules.some(rule => !isRule(rule))) {
    throw new Error('rules.json contains invalid rules');
  }
  return rules;
}

async function updateGlossaryCache({cacheRef, now = () => new Date(), sourcePath = RULES_SOURCE_PATH} = {}) {
  const rules = await readRulesFromDisk({sourcePath});
  const updatedAt = now().toISOString();
  await cacheRef.set({
    rulesJson: JSON.stringify(rules),
    ruleCount: rules.length,
    updatedAt,
    sourcePath: path.relative(process.cwd(), sourcePath),
  });
  return {ruleCount: rules.length, updatedAt};
}

module.exports = {CACHE_PATH, RULES_SOURCE_PATH, readRulesFromDisk, updateGlossaryCache};


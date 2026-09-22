import { answersRecipes } from './groups/answers.js';
import { retrievalRecipes } from './groups/retrieval.js';
import { conversationRecipes } from './groups/conversation.js';
import { workflowRecipes } from './groups/workflow.js';
import { supportRecipes } from './groups/support.js';
import { knowledgeRecipes } from './groups/knowledge.js';

export const recipes = {
  ...answersRecipes,
  ...retrievalRecipes,
  ...conversationRecipes,
  ...workflowRecipes,
  ...supportRecipes,
  ...knowledgeRecipes,
};

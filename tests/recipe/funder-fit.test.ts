import { funderFit } from '../../recipes/funder-fit/index.js';
import { testComparison } from './helpers/comparison.js';

testComparison(funderFit, {
  program:
    'Mobile dental clinic serving uninsured adults in Harney and Malheur counties, rural eastern Oregon. Operated by Sagebrush Health Partners, a 501(c)(3) founded in 2019. Two clinic days per week rotating across four towns, providing cleanings, fillings, and extractions. Seeking about $120,000 for one year of clinical staffing and supplies.',
  firstOpportunity:
    'Hollis Family Foundation, Rural Health Access grants. Awards of $25,000 to $150,000 to nonprofit organizations delivering direct health services in rural counties of Oregon and Washington. Priority given to programs serving uninsured or underinsured adults. Applicants must hold 501(c)(3) status and have at least two years of operating history. Operating and program costs are eligible.',
  secondOpportunity:
    'Brightway Fund, Youth Wellness Initiative. Awards of $10,000 to $50,000 for school-based health and nutrition programs serving children ages 5 to 18 in the Portland metropolitan area. Public schools and their nonprofit partners are eligible. Capital and equipment purchases are not funded.',
});

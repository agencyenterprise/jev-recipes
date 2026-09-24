import { expenseCategory } from '../../recipes/expense-category/index.js';
import { testClassification } from './helpers/classification.js';

testClassification(
  expenseCategory,
  {
    expense:
      "Uber from the airport to the client's office for the Tuesday kickoff meeting, then back to the hotel.",
    categories:
      'Travel - Airfare: flights and airline fees.\nTravel - Ground: taxis, rideshares, rental cars, trains, and parking while traveling for business.\nMeals: food and drink while traveling or hosting clients.\nSoftware: subscriptions and licenses for work tools.\nOffice Supplies: consumable items for the office.',
  },
  ['matched', 'multiple', 'none', 'unclear'],
);

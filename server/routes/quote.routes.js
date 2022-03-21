import { Router } from 'express';
import * as QuoteController from '../controllers/quote.controller';
const router = new Router();

router.route('/').get(QuoteController.getQuotes);

router.route('/random').get(QuoteController.getRandomQuote);

router.route('/:quote_id').get(QuoteController.getQuote);

router.route('/').post(QuoteController.addQuote);

router.route('/:quote_id').put(QuoteController.updateQuote);

router.route('/:quote_id').delete(QuoteController.deleteQuote);

export default router;

import { Router } from 'express';
import * as TipController from '../controllers/tip.controller';
const router = new Router();

// Get all Tips
router.route('/tips').get(TipController.getTips);

// Get one tip by id
router.route('/tips/:id').get(TipController.getTip);

// Add a new Tip
router.route('/tips').post(TipController.addTip);

// Delete a tip by id
router.route('/tips/:id').delete(TipController.deleteTip);

export default router;

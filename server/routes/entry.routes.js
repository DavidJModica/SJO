import { Router } from 'express';
import * as EntryController from '../controllers/entry.controller';
const router = new Router();

router.route('/').get(EntryController.getEntries);

router.route('/:entry_id').get(EntryController.getEntry);

router.route('/').post(EntryController.addEntry);

router.route('/:entry_id').put(EntryController.updateEntry);

router.route('/:entry_id').delete(EntryController.deleteEntry);

export default router;

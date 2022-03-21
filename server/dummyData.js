import Entry from './models/entry';

export default function () {
  Entry.count().exec((err, count) => {
    if (count > 0) {
      return;
    }

    const entry1 = new Entry({ type: 'daily' });
    const entry2 = new Entry({ type: 'weekly' });

    Entry.create([entry1, entry2], (error) => {
      if (!error) {
        // console.log('ready to go....');
      }
    });
  });
}

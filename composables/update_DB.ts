/** 將最後一筆資料的continuation設為false */
export const updateContinuation = async (): Promise<void> => {
  console.log("updateContinuation Start");
  try {
    const collection = getCollection();
    const last = await collection.find().sort({ _id: -1 }).limit(1).toArray();
    if (last.length) {
      const _id = last[0]._id;
      await collection.updateOne({ _id }, { $set: { continuation: false } });
      console.log("updateContinuation Success");
    } else {
      console.log("no last");
    }
  } catch {
    console.log("updateContinuation Error");
  }
};

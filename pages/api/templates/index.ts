import { getApp } from "firebase/app";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { log } from "next-axiom";
import { COLLECTION } from "../../../utils/firebase";
import { DOC } from "../../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      log.info(`Getting all templates`);
      const db = getFirestore(getApp());
      const query_ = query(collection(db, COLLECTION.TEMPLATES));
      const querySnapshot = await getDocs(query_);
      let docs: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        docs.push({ id: doc.id, ...data });
      });

      // return docs as Pick<
      //   DOC,
      //   "id" | "img" | "template_name" | "type" | "data"
      // >[];
      return res.json({
        status: true,
        data: docs,
      });
    } catch (error: any) {
      log.error(`Failed to get all templates`, error);
      return [];
    }
  }

  return res.status(404).send("Invalid route");
}

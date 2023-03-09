import { Request, Response, NextFunction } from "express";
import { uuid } from "uuidv4";
import multer from "multer";

// firebase
import { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import firebaseApp from "../config/firebase.config";

export const upload = multer({ storage: multer.memoryStorage() });

// initialize Cloud Storage and get the service
export const storage = getStorage(firebaseApp);

export async function uploadImage(req: Request, res: Response, next: NextFunction) {
    const files = req.files;
    try {
        const downloadURLs = await Promise.all(
            (files as any)?.map(async (file: any) => {
                // set reference(target) to destination bucket
                const storageRef = ref(storage, `images/${uuid()}`);

                const metadata = {
                    contentType: "image/jpeg"
                }
                
                // snapshot: send request and upload images to Firebase
                const snapshot = await uploadBytesResumable(storageRef, (file as any)?.buffer , metadata);

                const downloadURL = await getDownloadURL(snapshot.ref);

                return downloadURL;
            })
        );

        return downloadURLs;

    } catch (err: any) {
        throw new Error(err.message);
    }
}

export async function deleteImage(imageURI: any){
    const deleteRef = ref(storage, imageURI);

    deleteObject(deleteRef)
    .then(res => {
        return;
    })
    .catch(err => {
        throw new Error(err.message);
    })
}
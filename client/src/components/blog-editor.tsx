import { useState, useRef, useEffect } from "react";
import { Editor, IAllProps } from "@tinymce/tinymce-react";
import { storage } from "../../firebaseConfig";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { Editor as TinyMCEEditor } from "tinymce";
import { BlogEditorProps } from "@/typings/interfaces";

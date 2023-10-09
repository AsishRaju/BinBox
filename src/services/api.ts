import { FileWithPath } from "@mantine/dropzone";
import axios from "axios";
import dayjs from "dayjs";

const getSignedUrl = async (body: any) => {
  try {
    const response = await axios.post(`https://d37729g2srnlx.cloudfront.net/prod/getPreSignUrl`, body, {
      headers: {
        "x-api-key": "Dh2j2oj3kd7FiTmEaMJan9oi1aA9DfcAaxL0qElv",
      },
    });
    console.log(response);
    if (response?.data) {
      return response.data;
    }
  } catch (error) {
    console.log("getSignedUrl error", error);
    throw error;
  }
};

const fileUploadHandler = async (file: FileWithPath, userId: string) => {
  try {
    const body = {
      objectKey: `${userId}/${file.path}`,
      contentType: file.type,
    };
    const signedUrlResponse = await getSignedUrl(body);
    if (signedUrlResponse) {
      await axios({
        method: "put",
        url: signedUrlResponse.signedUrl,
        headers: {
          "Content-Type": file.type,
          "Access-Control-Allow-Origin": "*",
        },
        data: await file.arrayBuffer(),
      });
      return { fileKey: body.objectKey, fileName: file.path };
    }
    return { fileKey: undefined, fileName: undefined };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const addFileToDB = async (fileKey: string, fileName: string, fileDesc: string, userId: string, userEmail: string) => {
  try {
    const body = {
      fileKey,
      fileDesc,
      fileName,
      userId,
      userEmail,
    };

    const response = await axios.post(`https://d37729g2srnlx.cloudfront.net/prod/updateDb`, body, {
      headers: {
        "x-api-key": "Dh2j2oj3kd7FiTmEaMJan9oi1aA9DfcAaxL0qElv",
      },
    });
    console.log(response);
    if (response?.data) {
      return response.data;
    }
  } catch (error) {
    console.log("addFileToDb error", error);
    throw error;
  }
};

const updateFileToDB = async (fileKey: string, bbKey: string, fileName: string, fileDesc: string) => {
  try {
    const body = {
      bbKey,
      fileDesc,
      fileKey,
      fileName,
    };

    const response = await axios.put(`https://d37729g2srnlx.cloudfront.net/prod/updateDb`, body, {
      headers: {
        "x-api-key": "Dh2j2oj3kd7FiTmEaMJan9oi1aA9DfcAaxL0qElv",
      },
    });
    console.log(response);
    if (response?.data) {
      return response.data;
    }
  } catch (error) {
    console.log("addFileToDb error", error);
    throw error;
  }
};

const getFilesList = async (userId: string) => {
  try {
    const response = await axios.get(`https://d37729g2srnlx.cloudfront.net/prod/updateDb?userId=${userId}`, {
      headers: {
        "x-api-key": "Dh2j2oj3kd7FiTmEaMJan9oi1aA9DfcAaxL0qElv",
      },
    });
    console.log(response);
    if (response?.data) {
      return response.data.map((eachData: any) => {
        console.log(eachData["lastUpdatedAt"], dayjs(eachData["lastUpdatedAt"]).format("LLL"));
        return {
          id: eachData["bb-pk"],
          userEmail: eachData["userEmail"],
          lastUpdatedAt: dayjs(eachData["lastUpdatedAt"]).format("lll"),
          uploadedAt: dayjs(eachData["uploadedAt"]).format("lll"),
          fileName: eachData["fileName"],
          fileDesc: eachData["fileDesc"],
          filePath: eachData["fileKey"],
        };
      });
    }
  } catch (error) {
    console.log("getFilesList error", error);
    throw error;
  }
};

const deleteEntry = async (fileKey: string, bbkey: string) => {
  try {
    const response = await axios.delete(
      `https://d37729g2srnlx.cloudfront.net/prod/updateDb?fileKey=${encodeURIComponent(fileKey)}&bbKey=${bbkey}`,
      {
        headers: {
          "x-api-key": "Dh2j2oj3kd7FiTmEaMJan9oi1aA9DfcAaxL0qElv",
        },
      }
    );
    console.log(response);
  } catch (error) {
    console.log("delete entry error", error);
    throw error;
  }
};

export { fileUploadHandler, deleteEntry, addFileToDB, getFilesList, updateFileToDB };

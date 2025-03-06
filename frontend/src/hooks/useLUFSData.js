import { useState, useEffect } from "react";

const fetchJSON = async (filePath) => {
  try {
    console.log(filePath);
    const response = await fetch(filePath);
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching JSON:", error);
    return null;
  }
};

const processLUFSData = (lufsData) => {
  const result = {};
  Object.keys(lufsData).forEach((pid) => {
    const values = lufsData[pid].LUFS.Values;
    if (values.length > 0) {
      const avgLUFS = values.reduce((a, b) => a + b, 0) / values.length;
      result[pid] = avgLUFS.toFixed(2);
    }
  });
  return result;
};

const fetchLUFSData = async (basePath, date) => {
  const nnValues = ["17", "20", "22"];
  let combinedData = {};

  for (const nn of nnValues) {
    const filePath = `${basePath}/json/TP${nn}/lufs_database_${nn}_${date}.json`;
    const data = await fetchJSON(filePath);
    if (data) Object.assign(combinedData, processLUFSData(data));
  }
  return combinedData;
};

const fetchProgramInfo = async (basePath) => {
  const nnValues = ["17", "20", "22"];
  let programMapping = {};

  for (const nn of nnValues) {
    const filePath = `${basePath}/json/TP${nn}/program_info_${nn}.json`;
    const data = await fetchJSON(filePath);
    if (data) {
        data.forEach((program) => {
            const programID = program.ProgramID; // ProgramIDを取得
          
            // `ServiceProvider` が `null` または `undefined` なら空配列を設定
            const serviceProvider = program.ServiceProvider
              ? program.ServiceProvider.split(",")
              : [];
          
            programMapping[programID] = serviceProvider;
          });
    }
  }
  return programMapping;
};

const useLUFSData = (basePath, date) => {
  const [lufsData, setLUFSData] = useState({});
  const [programData, setProgramData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const lufs = await fetchLUFSData(basePath, date);
      const program = await fetchProgramInfo(basePath);
      setLUFSData(lufs);
      setProgramData(program);
    };
    fetchData();
  }, [basePath, date]);

  return { lufsData, programData };
};

export default useLUFSData;

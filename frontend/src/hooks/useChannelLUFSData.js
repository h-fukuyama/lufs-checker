import { useState, useEffect } from "react";

const fetchJSON = async (filePath) => {
    try {
        console.log(`Fetching: ${filePath}`);
        const response = await fetch(filePath);
        if (!response.ok) throw new Error("Failed to fetch data");
        return await response.json();
    } catch (error) {
        console.error("Error fetching JSON:", error);
        return null;
    }
};

const formatTimestamp = (timestamp) => {
    return `${timestamp.slice(8, 10)}:${timestamp.slice(10, 12)}`;
};

const findClosestData = (updatedAtValues, targetTime) => {
    let closestData = null;
    let closestTimeDiff = Infinity;

    updatedAtValues.forEach((updatedAt, index) => {
        const time = updatedAt.slice(8, 14); // Extract HHMMSS from YYYYMMDDHHMMSS
        const timeDiff = Math.abs(parseInt(time) - parseInt(targetTime));

        if (timeDiff < closestTimeDiff) {
            closestTimeDiff = timeDiff;
            closestData = { time: formatTimestamp(updatedAt), lufs: updatedAtValues[index] };
        }
    });

    return closestData;
};

const fetchProgramInfo = async (basePath, channel) => {
    const nnValues = ["17", "20", "22"];
    let programMapping = {};

    for (const nn of nnValues) {
        const filePath = `${basePath}/json/TP${nn}/program_info_${nn}.json`;
        const data = await fetchJSON(filePath);
        if (data) {
            data.forEach((program) => {
                const programID = program.ProgramID;
                const serviceProvider = program.ServiceProvider
                    ? program.ServiceProvider.split(",")
                    : [];
                const serviceName = program.ServiceName || "Unknown";

                if (serviceProvider.includes(channel)) {
                    programMapping[programID] = { serviceName, tp: nn };
                }
            });
        }
    }
    return programMapping;
};
const fetchLUFSData = async (basePath, programIDs, startDate, endDate, startTime, endTime) => {
    let combinedData = [];

    for (const { programID, tp } of programIDs) {
        let currentDate = parseInt(startDate);
        const endDateInt = parseInt(endDate);

        while (currentDate <= endDateInt) {
            const filePath = `${basePath}/json/TP${tp}/lufs_database_${tp}_${currentDate}.json`;
            const data = await fetchJSON(filePath);

            if (data && data[programID] && data[programID].LUFS) {
                const { Values, UpdatedAt } = data[programID].LUFS;

                const targetStartTime = startDate + startTime;
                const targetEndTime = endDate + endTime;

                const filteredData = Values.map((value, index) => {
                    const updatedAt = UpdatedAt[index];
                    if (updatedAt >= targetStartTime && updatedAt <= targetEndTime) {
                        return {
                            time: formatTimestamp(updatedAt),
                            lufs: value,
                            programID,
                            tp,
                        };
                    }
                    return null;
                }).filter(item => item !== null);

                if (filteredData.length === 0) {
                    // No data found in range, get closest to endTime
                    const closestData = findClosestData(UpdatedAt, targetEndTime);
                    if (closestData) {
                        filteredData.push({
                            time: closestData.time,
                            lufs: closestData.lufs,
                            programID,
                            tp,
                        });
                    }
                }

                combinedData = combinedData.concat(filteredData);
            }

            // Stop if we've reached the end date
            if (currentDate === endDateInt) break;

            // Increment the date
            currentDate += 1;
        }
    }

    return combinedData;
};

// Hook: LUFSデータ + ServiceName を取得
const useChannelLUFSData = (basePath, channel, startDate, startTime, endDate, endTime) => {
    const [lufsData, setLUFSData] = useState([]);
    const [serviceName, setServiceName] = useState("Unknown");

    useEffect(() => {
        const fetchData = async () => {
            const programInfo = await fetchProgramInfo(basePath, channel);
            const programIDs = Object.keys(programInfo).map((programID) => ({
                programID,
                tp: programInfo[programID].tp,
            }));

            if (programIDs.length > 0) {
                setServiceName(programInfo[programIDs[0].programID].serviceName);
            }

            const lufs = await fetchLUFSData(basePath, programIDs, startDate, endDate, startTime, endTime);
            setLUFSData(lufs);
        };

        fetchData();
    }, [basePath, channel, startDate, startTime, endDate, endTime]);

    return { lufsData, serviceName };
};

export default useChannelLUFSData;
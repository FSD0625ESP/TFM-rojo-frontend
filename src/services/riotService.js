import { makeRequest } from "./apiService";

export const fetchSummoner = (gameName, tagLine) => {
    const endpoint = `/lol/summoner?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}`;
    return makeRequest(endpoint);
};

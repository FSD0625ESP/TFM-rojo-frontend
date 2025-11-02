import { makeRequest } from "./apiService";

//fetch para buscar un summoner por gameName y tagLine
export const fetchSummoner = (gameName, tagLine) => {
  const endpoint = `/lol/summoner?gameName=${encodeURIComponent(
    gameName
  )}&tagLine=${encodeURIComponent(tagLine)}`;
  return makeRequest(endpoint);
};

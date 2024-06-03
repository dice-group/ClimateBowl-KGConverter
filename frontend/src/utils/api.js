import axios from "axios";
async function sendQuery(query) {
  let response;
  // let username = process.env.USERNAME;
  // let password = process.env.PASSWORD;
  // let basicAuth = "Basic " + btoa(username + ":" + password);
  response = await axios.post(
    "http://climatebowl.cs.upb.de:3030/climate_bowl/sparql",
    null,
    {
      params: {
        query: query,
      },
    }
  );

  const dataArray = [
    response.data.head["vars"],
    response.data.results["bindings"],
  ];

  const formatedData = dataArray[1]?.map((item, index) => {
    const rowData = Object.keys(item).map((key) => item[key].value);
    let objectData = {};
    for (let i = 0; i < rowData.length; i++) {
      objectData[dataArray[0][i]] = rowData[i];
    }
    return objectData;
  });
  return formatedData;
}

export default sendQuery;

import { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import sendQuery from "./../utils/api";

function DropdownComponent({ row, index, updatePCFValue }) {
  const [availableOptions, setAvailableOptions] = useState([
    {
      name: row.fluss,
      emissionsfaktor: row.emissionsfaktor,
      region: row.region,
      year: row.year,
      result: row.result,
    },
  ]);
  const [buttonValue, setButtonValue] = useState(row.fluss);
  const updatePCF = (newData) => {
    row.fluss = newData.name;
    row.emissionsfaktor = newData.emissionsfaktor;
    row.region = newData.region;
    row.year = newData.year;
    row.result = row.menge * newData.emissionsfaktor;
    updatePCFValue(row, index, newData.name);
    setButtonValue(newData.name);
  };
  const getRelatedValues = async (e, name) => {
    const queryValue = `
    PREFIX : <https://climatebowl.data.dice-research.org/ontology/>
SELECT  ?item ?type ?name ?emissionsfaktor ?region ?year
WHERE {
  {
        SELECT DISTINCT ?type
        WHERE {
          ?item a ?type .
          ?item :itemName "${name}" .
        }
      }
  ?item a ?type;
            :itemName ?name;
                :emissionenWert ?emissionsfaktor;
                :region ?region;
                :jahr ?year.# Use the selected ?type from the subquery
}`;
    try {
      console.log(result);
      var result = await sendQuery(queryValue);
      console.log(result);
      // .then((result) => {
      setAvailableOptions([...result]);
      // });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Dropdown onClick={(e) => getRelatedValues(e, buttonValue)}>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {buttonValue}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {availableOptions.map((item, index) => (
          <Dropdown.Item
            onClick={() => updatePCF(item)}
            href={`#/action-${index}`}
          >
            {item.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropdownComponent;

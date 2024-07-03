import { useState } from "react";
import sendQuery from "./../utils/api";
import AsyncSelect from "react-select/async";
function DropdownComponent({ row, index, updatePCFValue }) {
  const [selectedOption, setSelectedOption] = useState({
    value: row,
    label: row.fluss,
  });

  const handleChange = (selectedOption) => {
    console.log(selectedOption);
    setSelectedOption(selectedOption);
    updatePCF(selectedOption.value);
  };
  const updatePCF = (newData) => {
    row.fluss = newData.name;
    row.emissionsfaktor = newData.emissionsfaktor;
    row.region = newData.region;
    row.year = newData.year;
    row.result = row.menge * newData.emissionsfaktor;
    updatePCFValue(row, index, newData.name);
  };

  const fetchOptions = async (inputValue) => {
    if (inputValue.length < 3) {
      return [];
    }
    const queryValue = `PREFIX : <https://climatebowl.data.dice-research.org/ontology/>

    SELECT DISTINCT ?name ?item ?region ?year ?emissionsfaktor
    WHERE {
      ?item :emissionenWert ?emissionsfaktor;
            :itemName ?name;
            :region ?region;
            :jahr ?year.
            
    FILTER(CONTAINS(LCASE(STR(?name)), "${inputValue}"))
    }
    `;

    try {
      console.log(result);
      var result = await sendQuery(queryValue);

      return result.map((item) => ({
        value: item,
        label: item.name,
      }));

      // });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <>
      <div className="" style={{ minWidth: "300px" }}>
        <AsyncSelect
          value={selectedOption}
          cacheOptions
          defaultOptions
          onChange={handleChange}
          loadOptions={fetchOptions}
          placeholder="Select an option"
          closeMenuOnSelect={true}
          title={selectedOption ? selectedOption.label : ""}
        />
      </div>
    </>
  );
}

export default DropdownComponent;

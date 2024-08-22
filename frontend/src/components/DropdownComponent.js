import { useState } from "react";
import sendQuery from "./../utils/api";
import AsyncSelect from "react-select/async";
function DropdownComponent({ row, index, updatePCFValue }) {
  const [selectedOption, setSelectedOption] = useState({
    value: row,
    label: row.flow,
  });

  const handleChange = (selectedOption) => {
    console.log(selectedOption);
    setSelectedOption(selectedOption);
    updatePCF(selectedOption.value);
  };
  const updatePCF = (newData) => {
    row.flow = newData.name;
    row.emissionsfactor = newData.emissionsfactor;
    row.region = newData.region;
    row.year = newData.year;
    row.result = row.value * newData.emissionsfactor;
    updatePCFValue(row, index, newData.name);
  };

  const fetchOptions = async (inputValue) => {
    if (inputValue.length < 3) {
      return [];
    }
    const queryValue = `PREFIX : <http://w3id.org/dice-research/climatebowl/ontology#>

    SELECT DISTINCT ?name ?item ?region ?year ?emissionsfactor
    WHERE {
      ?item :emissionsValue ?emissionsfactor;
            :itemName ?name;
            :region ?region;
            :year ?year.
            
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
  const noOptionsMessage = ({ inputValue }) => {
    return inputValue.length < 3
      ? "Type at least 3 letters to see options"
      : "No options";
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
          noOptionsMessage={noOptionsMessage}
        />
      </div>
    </>
  );
}

export default DropdownComponent;

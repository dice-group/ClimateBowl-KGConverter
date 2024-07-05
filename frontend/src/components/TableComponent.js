import React from "react";
import { Container, Table } from "react-bootstrap";
import DropdownComponent from "./DropdownComponent";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
const TableComponent = ({ data, originalData, updatePCFValue }) => {
  var headers = [];
  var newData = [];
  if (data.length !== 0) {
    headers = Object.keys(data[0]);
    newData = data;
  }
  var excludedColumns = [
    "menge",
    "unit",
    "emissionsfaktor",
    "company",
    "kategorie",
  ];
  var difference = [];
  if (originalData.length !== 0 && newData.length !== 0) {
    // console.log(data, originalData);
    originalData.map((value, key) => {
      difference[key] = data[key].result - originalData[key].result;
      // data[key].result !== 0
      //   ? originalData[key].result < data[key].result
      //     ? originalData[key].result / data[key].result
      //     : data[key].result / originalData[key].result
      //   : 0;
    });
  }
  return (
    <>
      <Container fluid className="mt-2">
        <hr></hr>
        <h4>PCF tracking</h4>
        <hr></hr>
        <p>
          *Note: the dropdown has dummy options, start typing "material" and
          "energy" to get options.
        </p>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              {headers.map(
                (item, index) =>
                  !excludedColumns.includes(item) && <th>{item}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {newData.map((row, key) => (
              <tr>
                {Object.entries(row).map((item, index) => {
                  if (item[0] === "fluss") {
                    return (
                      <td>
                        <DropdownComponent
                          row={row}
                          index={key}
                          updatePCFValue={updatePCFValue}
                        ></DropdownComponent>
                      </td>
                    );
                  } else if (item[0] === "result") {
                    return (
                      <td>
                        {item[1]}
                        {difference[key] !== 0 ? (
                          difference[key] < 0 ? (
                            <span className="bg-success bg-opacity-50 m-2 p-1 rounded-1">
                              <FaArrowDown
                                className="text-white"
                                style={{ fontSize: "12px" }}
                              />
                              <text className="text-white p-1">
                                {Math.round(
                                  -1 *
                                    (item[1] / (item[1] - difference[key]) -
                                      1) *
                                    10000
                                ) / 100}
                                %
                              </text>
                            </span>
                          ) : (
                            <span className="bg-danger bg-opacity-50 m-2 p-1 rounded-1">
                              <FaArrowUp
                                className="text-white"
                                style={{ fontSize: "12px" }}
                              />
                              <text className="text-white p-1">
                                {Math.round(
                                  (item[1] / (item[1] - difference[key]) - 1) *
                                    10000
                                ) / 100}
                                %
                              </text>
                            </span>
                          )
                        ) : null}
                      </td>
                    );
                  } else if (!excludedColumns.includes(item[0]))
                    return (
                      <td>
                        {excludedColumns.includes(item[1])}
                        {item[1]}
                      </td>
                    );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default TableComponent;

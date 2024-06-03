import React, { useEffect } from "react";
import { Table } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import Chart from "chart.js/auto";

function updateData(data) {
  // console.log(data);
  let phasesArray = {};
  let total = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].scope in phasesArray) {
      phasesArray[data[i].scope] =
        phasesArray[data[i].scope] + parseFloat(data[i].result);
    } else {
      phasesArray[data[i].scope] = parseFloat(data[i].result);
    }
    total = total + parseFloat(data[i].result);
  }
  phasesArray["Total"] = total;
  return Object.keys(phasesArray).map((key) => {
    return [key, phasesArray[key]];
  });
}

const Scopes = ({ data, originalData }) => {
  var difference = [];
  const filteredData = updateData(data);
  if (originalData.length !== 0 && data.length !== 0) {
    var results = updateData(originalData);
    results.map((value, key) => {
      difference[key] = filteredData[key][1] - results[key][1];
    });
  }
  useEffect(() => {
    let myChart = null; // Variable to store the chart instance

    // Function to initialize and render the chart
    const renderChart = () => {
      const canvas = document.getElementById("scopesChart");
      const ctx = canvas.getContext("2d");

      var results = updateData(originalData);

      const labels = results.map((item) => item[0]);
      const datasetData = results.map(
        (item) => ((item[1] / results[results.length - 1][1]) * 10000) / 100
      );
      // Destroy existing chart if it exists
      if (myChart) {
        myChart.destroy();
      }
      var sum = [];
      for (var i = 0; i < datasetData.length; i++) {
        sum.push(
          datasetData[i] +
            Math.round(
              (difference[i] / results[results.length - 1][1]) * 10000
            ) /
              100
        );
      }
      const borderColor = sum.map((val, i) =>
        val <= datasetData[i]
          ? "rgba(178, 222, 39, 1)"
          : "rgba(255, 99, 132, 1)"
      );
      const backgroundColor = sum.map((val, i) =>
        val <= datasetData[i]
          ? "rgba(178, 222, 39, 0.5)"
          : "rgba(255, 99, 132, 0.5)"
      );

      myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Data",
              data: datasetData,
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
            {
              label: "Difference",
              data: sum,
              type: "bar",
              backgroundColor: backgroundColor,
              borderColor: borderColor,
              borderWidth: 2,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || "";

                  if (label) {
                    label += ": ";
                  }
                  if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat("en-US").format(
                      context.parsed.y
                    );
                  }
                  return label + "%";
                },
              },
            },
          },
          scales: {
            y: {
              ticks: {
                callback: function (value, index, values) {
                  return value + "%";
                },
              },
            },
          },
        },
      });
    };

    // Call the function to render the chart
    renderChart();

    // Cleanup function to destroy the chart on component unmount
    return () => {
      if (myChart) {
        myChart.destroy();
      }
    };
  }, [filteredData]); // Empty dependency array ensures it runs once after mount

  return (
    <>
      <h1>3. Scopes</h1>
      <hr></hr>
      <Col xs lg="6">
        <Table striped bordered hover responsive m-auto>
          <tbody>
            {filteredData?.map((row, index) => (
              <tr key={index}>
                <td>{row[0]}</td>
                <td>
                  {Math.round(
                    (row[1] / filteredData[filteredData.length - 1][1]) * 10000
                  ) / 100}
                  %
                  {difference[index] !== 0 ? (
                    difference[index] < 0 ? (
                      <span className="bg-success bg-opacity-50 m-2 p-1 rounded-1">
                        <FaArrowDown
                          className="text-white"
                          style={{ fontSize: "12px" }}
                        />
                        <text className="text-white p-1">
                          {Math.round((difference[index] / row[1]) * 10000) /
                            100}
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
                          {Math.round((difference[index] / row[1]) * 10000) /
                            100}
                          %
                        </text>
                      </span>
                    )
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
      <Col xs lg="6">
        <canvas id="scopesChart" width="800" height="450"></canvas>
      </Col>
    </>
  );
};

export default Scopes;

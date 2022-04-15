import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { StoreContext } from "../store";
import Grid from "@mui/material/Grid";
import Zoom from "@mui/material/Zoom";
import Link from "next/link";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import PageviewIcon from "@mui/icons-material/Pageview";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";
import GppGoodIcon from "@mui/icons-material/GppGood";
import Web3 from "web3";
import { abiOwnerManager } from "../contracts/OwnerManager";
import Stack from "@mui/material/Stack";
import Slide from "@mui/material/Slide";
import Grow from "@mui/material/Grow";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import ChartDataLabels from "chartjs-plugin-datalabels";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CoreChartOptions,
  TitleOptions,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar, Doughnut, Pie, Line } from "react-chartjs-2";
import faker from "@faker-js/faker";
import { _DeepPartialObject } from "chart.js/types/utils";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Paper,
  Skeleton,
} from "@mui/material";

// ChartJS.register(ArcElement, Tooltip, Legend);

ChartJS.register(
  CategoryScale,
  ChartDataLabels,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const optionBar = {
  responsive: true,
  plugins: {
    datalabels: {
      display: false,
      formatter: (value, context) => {
        return Number(value).toFixed(2);
      },
      color: "#fff",
    },
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Balance and Transactions Count",
      position: "bottom" as const,
    },
  },
};

// export const dataLine = {
//   labels: ["January", "February", "March", "April", "May", "June", "July"],
//   datasets: [
//     {
//       label: "Dataset 1",
//       data: [
//         "January",
//         "February",
//         "March",
//         "April",
//         "May",
//         "June",
//         "July",
//       ].map(() => faker.datatype.number({ min: -1000, max: 1000 })),
//       borderColor: "rgb(255, 99, 132)",
//       backgroundColor: "rgba(255, 99, 132, 0.5)",
//     },
//     {
//       label: "Dataset 2",
//       data: [
//         "January",
//         "February",
//         "March",
//         "April",
//         "May",
//         "June",
//         "July",
//       ].map(() => faker.datatype.number({ min: -1000, max: 1000 })),
//       borderColor: "rgb(53, 162, 235)",
//       backgroundColor: "rgba(53, 162, 235, 0.5)",
//     },
//   ],
// };

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const initContract = (addr: string) =>
  new web3.eth.Contract(abiOwnerManager as any[], addr);

export default function Statistic() {
  const [dataBar, setDataBar] = React.useState({ labels: [], datasets: [] });
  const [dataPieBalance, setDataPieBalance] = React.useState({
    labels: [],
    datasets: [],
  });
  const [dataPieTransaction, setDataPieTransaction] = React.useState({
    labels: [],
    datasets: [],
  });

  const [dataLine, setDataLine] = React.useState({
    labels: [],
    datasets: [],
  });
  const [age, setAge] = React.useState<string | number>("");
  const [dataSelect, setDataSelect] = React.useState([]);
  const [dataSelected, setDataSelected] = React.useState<string>("");
  const [rows, setRows] = React.useState([]);
  const [eachBalance, setEachBalance] = React.useState([]);
  const [eachAddress, setEachAddress] = React.useState([]);
  const [eachTransaction, setEachTransaction] = React.useState([]);
  const [eachGasUsed, setEachGasUsed] = React.useState([[]]);
  const [data, setData] = React.useState([[]]);
  // const [balance, setBalance] = React.useState([0, 0]);
  const [open, setOpen] = React.useState(false);
  const { accountContext, addressContext, signatureContext } =
    React.useContext(StoreContext);
  const [creditScore, setCreditScore] = React.useState(105);

  const [accounts, setAccounts] = accountContext;
  const [loading, setLoading] = React.useState(false);
  const color = [
    "#003f5c",
    "#2f4b7c",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "#ffa600",
  ];

  const colorSpringPastels = [
    "#fd7f6f",
    "#7eb0d5",
    "#b2e061",
    "#bd7ebe",
    "#ffb55a",
    "#ffee65",
    "#beb9db",
    "#fdcce5",
    "#8bd3c7",
  ];

  const optionLine = {
    responsive: true,
    plugins: {
      datalabels: {
        display: false,
      },
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: `Total Gas Used Last 25 Transactions: ${eachGasUsed.reduce(
          (a, b) => {
            return (
              a +
              b.reduce((sum, item) => {
                return sum + Number(item.gasUsed);
              }, 0)
            );
          },
          0
        )} Wei`,
        position: "bottom" as const,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          // text: "Last 25 transactions",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Value (Wei)",
        },
      },
    },
  };

  const optionPieTransaction = {
    type: "pie",
    responsive: true,
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          const sum = context.chart.data.datasets[0].data.reduce(
            (a: number, b: number) => Number(a) + Number(b),
            0
          );
          return Math.round((value / sum) * 100) + "%";
        },
        color: "#fff",
      },
      tooltip: {
        enabled: true,
      },
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Transaction Count: ${eachTransaction.reduce(
          (a, b) => a + b,
          0
        )}`,
        position: "bottom" as const,
      },
    },
  };

  const optionPieBalance = {
    responsive: true,
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          const sum = context.chart.data.datasets[0].data.reduce(
            (a: number, b: number) => Number(a) + Number(b),
            0
          );
          return Math.round((value / sum) * 100) + "%";
        },
        color: "#fff",
      },
      tooltip: {
        enabled: true,
      },
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Balance ${eachBalance
          .reduce((a, b) => a + Number(b), 0)
          .toFixed(4)}`,
        position: "bottom" as const,
      },
    },
    // elements: {
    //   arc: {
    //     borderWidth: 0,
    //   },
    // },
  };

  function getRandomRgb() {
    var num = Math.round(0xffffff * Math.random());
    var r = num >> 16;
    var g = (num >> 8) & 255;
    var b = num & 255;
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }

  React.useEffect(() => {
    if (accounts.length < 0) {
      setDataSelect([]);
      return;
    }

    axios
      .get(`http://${window.location.hostname}:4000/wallets`)
      .then((response) => {
        setDataSelect(response.data.filter((item) => item.isIdentified));
      });
  }, [accounts]);

  React.useEffect(() => {
    setDataBar({
      labels: eachAddress,
      datasets: [
        {
          label: "Balance",
          data: eachBalance,
          // backgroundColor: "rgba(255, 99, 132, 0.5)",
          backgroundColor: "#f95d6a",
        },
        {
          label: "Transaction Count",
          data: eachTransaction,
          // backgroundColor: "rgba(53, 162, 235, 0.5)",
          backgroundColor: "#665191",
        },
      ],
    });

    setDataPieBalance({
      labels: eachAddress,
      datasets: [
        {
          label: "Balance",
          data: eachBalance,
          // backgroundColor: eachAddress.map((item) => getRandomRgb()),
          backgroundColor: color.slice(0, eachAddress.length),
          hoverOffset: 4,
        },
      ],
    });

    setDataPieTransaction({
      labels: eachAddress,
      datasets: [
        {
          label: "Transaction",
          data: eachTransaction,
          backgroundColor: color.slice(0, eachAddress.length),
          hoverOffset: 4,
        },
      ],
    });

    setDataLine({
      labels: Array.from(Array(25).keys()),
      datasets: eachGasUsed.map((item, index) => ({
        // label: `Address ${index + 1}`,
        label: eachAddress[index],
        data: item.map((d) => d.gasUsed),
        borderColor: colorSpringPastels[index],
        backgroundColor: colorSpringPastels[index],
      })),

      // [
      //   {
      //     label: "Data One",
      //     data: [3, 43, 54, 46],
      //     borderColor: "rgb(53, 162, 235)",
      //     backgroundColor: "rgba(53, 162, 235, 0.5)",
      //   },
      //   {
      //     label: "Data Two",
      //     data: [3, 43, 54, 46],
      //     borderColor: "rgb(53, 162, 235)",
      //     backgroundColor: "rgba(53, 162, 235, 0.5)",
      //   },
      // ],
    });
  }, [eachAddress, eachBalance, eachTransaction, eachGasUsed, data]);

  const handleChange = async (
    event: SelectChangeEvent<typeof dataSelected>
  ) => {
    setLoading(true);
    setDataSelected(event.target.value);

    // console.log(eachGasUsed);

    const owners = await initContract(event.target.value)
      .methods.getOwners()
      .call();

    setEachAddress(owners);

    setEachTransaction(
      await Promise.all(
        owners.map(async (item) => await web3.eth.getTransactionCount(item))
      )
    );

    setEachBalance(
      await Promise.all(
        owners.map(async (item) =>
          web3.utils.fromWei(await web3.eth.getBalance(item))
        )
      )
    );

    setEachGasUsed(
      await Promise.all(
        owners.map(async (item) => {
          const result = await axios.get(
            `https://api-ropsten.etherscan.io/api?module=account&action=txlist&address=${item}&startblock=0&endblock=99999999&page=1&offset=200&sort=asc&apikey=H77KF8THJ7PJ9V5HWDQBFBMFYSP24FMPPU`
          );
          return result.data.result.slice(-25);
        })
      )
    );

    // setData(
    //   await Promise.all(
    //     owners.map(async (item) => {
    //       const result = await axios.get(
    //         `https://api-ropsten.etherscan.io/api?module=account&action=txlist&address=${item}&startblock=0&endblock=99999999&page=1&offset=200&sort=asc&apikey=H77KF8THJ7PJ9V5HWDQBFBMFYSP24FMPPU`
    //       );
    //       return result.data.result;
    //     })
    //   )
    // );

    // handleCreditScore();

    const pData = await Promise.all(
      owners.map(async (item) => {
        const result = await axios.get(
          `https://api-ropsten.etherscan.io/api?module=account&action=txlist&address=${item}&startblock=0&endblock=99999999&page=1&offset=200&sort=asc&apikey=H77KF8THJ7PJ9V5HWDQBFBMFYSP24FMPPU`
        );
        return result.data.result;
      })
    );

    console.log(pData);

    let pBalance = await Promise.all(
      owners.map(async (item) =>
        web3.utils.fromWei(await web3.eth.getBalance(item))
      )
    );
    let pAgeAddress = pData.map((item) => {
      return Math.floor(
        (Date.now() / 1000 - Number(item[0].timeStamp)) / 3600 / 24
      );
    });
    let pNumTransaction = pData.map((item) => item.length);
    let pValueTransaction = pData.map((item) => {
      return (
        item.reduce((a, b) => {
          return a + Number(b.value);
        }, 0) / 1000000000000000000
      );
    });

    console.log(pBalance, pAgeAddress, pNumTransaction, pValueTransaction);
    let maxCreditScore = 0;
    for (let i = 0; i < pBalance.length; i++) {
      let pCreditScore =
        Math.floor(
          0.25 * 0.4 * pBalance[i] +
            0.35 *
              (0.3 * pAgeAddress[i] +
                0.3 * pNumTransaction[i] +
                0.4 * pValueTransaction[i])
        ) + 250;
      console.log(pCreditScore);
      maxCreditScore = Math.max(maxCreditScore, pCreditScore);
    }
    setCreditScore(maxCreditScore);

    setLoading(false);
  };

  const handleCreditScore = () => {
    console.log(creditScore);
    console.log(data);
    if (data.length !== 0) {
      let pBalance = eachBalance;
      let pAgeAddress = data.map((item) => {
        return Math.floor(
          (Date.now() / 1000 - Number(item[0].timeStamp)) / 3600 / 24
        );
      });
      let pNumTransaction = data.map((item) => item.length);
      let pValueTransaction = data.map((item) => {
        return (
          item.reduce((a, b) => {
            return a + Number(b.value);
          }, 0) / 1000000000000000000
        );
      });
      let maxCreditScore = 0;
      for (let i = 0; i < pBalance.length; i++) {
        let pCreditScore =
          Math.floor(
            0.25 * 0.4 * pBalance[i] +
              0.35 *
                (0.3 * pAgeAddress[i] +
                  0.3 * pNumTransaction[i] +
                  0.4 * pValueTransaction[i])
          ) + 150;
        console.log(pCreditScore);
        maxCreditScore = Math.max(maxCreditScore, pCreditScore);
      }
      console.log(maxCreditScore);
      setCreditScore(maxCreditScore);
    }
  };

  const mappingCreditScore = (input) => {
    if (input >= 300 && input <= 574) {
      return "Poor";
    } else if (input >= 575 && input <= 659) {
      return "Below Average";
    } else if (input >= 600 && input <= 712) {
      return "Fair";
    } else if (input >= 713 && input <= 740) {
      return "Good";
    } else if (input >= 741 && input <= 900) {
      return "Excellent";
    } else {
      return "Very Poor";
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <Grid
      container
      spacing={2}
      direction="row"
      alignItems="center"
      justifyContent="center"
    >
      <Grid item xs={12}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <FormControl sx={{ my: 1, width: 300 }}>
              <InputLabel id="demo-controlled-open-select-label">
                Identification
              </InputLabel>
              <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
                value={dataSelected}
                label="Identification"
                onChange={handleChange}
              >
                {dataSelect.map((item, index) => {
                  // let mergeId = item.id + "&" + item.combineId;
                  return (
                    <MenuItem key={index} value={item.address}>
                      {item.title}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            {dataSelected.length > 0 && (
              <Button
                variant="outlined"
                sx={{ mt: 2, mb: 3, height: 56 }}
                onClick={handleCreditScore}
              >
                Credit Score
              </Button>
            )}
            {loading && (
              <Box sx={{ display: "flex" }}>
                <CircularProgress />
              </Box>
            )}
          </Stack>

          {/* <Stack direction="row" spacing={4}>
            <Typography variant="h5" component="h2">
              Total:{" "}
              {`${balance[0].toPrecision(5)} / ${balance[1].toPrecision(5)}`}{" "}
              ETH
            </Typography>
            <Typography variant="h5" component="h2">
              Credit Score: 500
            </Typography>
          </Stack> */}
        </Stack>
      </Grid>

      <Grid item xs={6}>
        <Card sx={{ minWidth: 275, border: 0.5 }}>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              {loading ? "Analyzing..." : "Word of the Day"}
            </Typography>
            <Typography variant="h5" component="div">
              Score: {creditScore}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {mappingCreditScore(creditScore)}
            </Typography>
            <Typography variant="body2">
              well meaning and kindly.
              <br />
              {'"a benevolent smile"'}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              onClick={() => {
                window.open(
                  "https://www.investopedia.com/terms/c/credit_score.asp",
                  "_blank"
                );
              }}
            >
              Learn More
            </Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid item xs={6}>
        <img
          src="credit-score.png"
          alt=""
          loading="lazy"
          // height="500"
          width="100%"
        />
      </Grid>
      {dataSelected.length > 0 && (
        <Grid item xs={6}>
          <Pie options={optionPieTransaction} data={dataPieTransaction} />
        </Grid>
      )}
      {dataSelected.length > 0 && (
        <Grid item xs={6}>
          <Pie options={optionPieBalance} data={dataPieBalance} />
        </Grid>
      )}

      {/* {dataSelected.length > 0 && (
        <Grid item xs={12}>
          <Bar options={optionBar} data={dataBar} />
        </Grid>
      )} */}

      {dataSelected.length > 0 && (
        <Grid item xs={12}>
          <Line options={optionLine} data={dataLine} />
        </Grid>
      )}
    </Grid>
  );
}

import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
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
import { abi } from "../contracts/ChainIdentification";
import { addressContract } from "../contracts/AddressContract";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Slide from "@mui/material/Slide";
import Grow from "@mui/material/Grow";
import Typography from "@mui/material/Typography";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import faker from "@faker-js/faker";
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

// ChartJS.register(ArcElement, Tooltip, Legend);

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "List address with balance and sum of transactions",
      position: "bottom" as const,
    },
  },
};

// const labels = ["January", "February", "March", "April", "May", "June", "July"];

// export const data = {
//   labels,
//   datasets: [
//     {
//       label: "Dataset 1",
//       data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
//       backgroundColor: "rgba(255, 99, 132, 0.5)",
//     },
//     {
//       label: "Dataset 2",
//       data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
//       backgroundColor: "rgba(53, 162, 235, 0.5)",
//     },
//   ],
// };

export default function Statistic() {
  const [data, setData] = React.useState({ labels: [], datasets: [] });
  const [age, setAge] = React.useState<string | number>("");
  const [dataSelect, setDataSelect] = React.useState([]);
  const [dataSelected, setDataSelected] = React.useState<string>("");
  const [rows, setRows] = React.useState([]);
  const [eachBalance, setEachBalance] = React.useState([]);
  const [eachTransaction, setEachTransaction] = React.useState([]);
  const [balance, setBalance] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const { messageContext, accountContext, addressContext, signatureContext } =
    React.useContext(StoreContext);
  const [accounts, setAccounts] = accountContext;
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (accounts.length < 0) {
      setDataSelect([]);
      return;
    }

    try {
      axios
        .get(
          `http://${window.location.hostname}:4000/addresses/identify/${accounts[0]}`
        )
        .then((response) => {
          setDataSelect(response.data);
        });
    } catch (err) {
      console.error(err);
    }
  }, [accounts]);

  React.useEffect(() => {
    async function returnData() {
      const returnValue = await axios.get(
        `http://${window.location.hostname}:4000/statistic`
      );
      return returnValue.data;
    }
    /*
    returnData().then((item) => {
      setData({
        labels: item.data.map((item: { name: string }) => item.name),
        datasets: [
          {
            label: "# of Votes",
            data: item.data.map(
              (item: { total_supply: string }) => item.total_supply
            ),
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(25, 159, 64, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ],
      });
    });
    */
  }, []);

  const handleChange = (event: SelectChangeEvent<typeof dataSelected>) => {
    let catchValue = event.target.value;
    let id = catchValue.split("&")[0];
    setBalance(0);
    setDataSelected(catchValue);
    axios
      .get(`http://${window.location.hostname}:4000/identifies/addresses/${id}`)
      .then((response) => {
        let sumBalance = 0;
        response.data
          .filter((item: { isVerify: boolean }) => item.isVerify == true)
          .forEach((item: { address: string }) => {
            web3.eth
              .getBalance(item.address)
              .then((value) => {
                console.log(item.address, value);
                setEachBalance([...eachBalance, Number(value)]);
                sumBalance += Number(value);
                // setBalance(balance + Number(value));
              })
              .then(() => setBalance(sumBalance / 10 ** 18));
          });
        // response.data.forEach((item) => {
        //   web3.eth
        //     .getBalance(item.address)
        //     .then((value) => setEachBalance([...eachBalance, Number(value)]));
        // });
        response.data.forEach((item) => {
          web3.eth
            .getTransactionCount(item.address)
            .then((value) =>
              setEachTransaction([...eachTransaction, Number(value)])
            );
        });
        setData({
          labels: response.data.map(
            // (item: any) => "Address " + (response.data.indexOf(item) + 1)
            (item: any) => item.address.substring(0, 20).concat("...")
          ),
          datasets: [
            {
              label: "Balance",
              // data: response.data.map(() =>
              //   faker.datatype.number({ min: 0, max: 1000 })
              // ),
              data: eachBalance,
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
            {
              label: "Transaction Count",
              data: eachTransaction,
              backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
          ],
        });
        setRows(
          response.data.map(
            (item: {
              id: string;
              uuid: string;
              message: string;
              infuralNetworks: string;
              address: string;
              isVerify: boolean;
            }) => ({
              id: response.data.indexOf(item) + 1,
              uuid: item.id,
              network: item.infuralNetworks,
              message: item.message.substring(0, 30).concat("..."),
              address: item.address,
              isVerify: item.isVerify,
            })
          )
        );
      });
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
      justifyContent="center"
      alignItems="center"
    >
      <Grid item xs={4}>
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
              let mergeId = item.id + "&" + item.combineId;
              return (
                <MenuItem key={index} value={mergeId}>
                  {item.title}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="h5" component="h2">
          {balance} ETH
        </Typography>
      </Grid>
      <Grid item xs={10}>
        <Bar options={options} data={data} />
      </Grid>
    </Grid>
  );
}

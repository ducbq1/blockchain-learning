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
import { abiOwnerManager } from "../contracts/OwnerManager";
import { factoryAddress } from "../contracts/FactoryAddress";
import Stack from "@mui/material/Stack";
import Slide from "@mui/material/Slide";
import Grow from "@mui/material/Grow";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";

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

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const initContract = (addr: string) =>
  new web3.eth.Contract(abiOwnerManager as any[], addr);

export default function Statistic() {
  const [data, setData] = React.useState({ labels: [], datasets: [] });
  const [age, setAge] = React.useState<string | number>("");
  const [dataSelect, setDataSelect] = React.useState([]);
  const [dataSelected, setDataSelected] = React.useState<string>("");
  const [rows, setRows] = React.useState([]);
  const [eachBalance, setEachBalance] = React.useState([]);
  const [eachAddress, setEachAddress] = React.useState([]);
  const [eachTransaction, setEachTransaction] = React.useState([]);
  const [balance, setBalance] = React.useState([0, 0]);
  const [open, setOpen] = React.useState(false);
  const { accountContext, addressContext, signatureContext } =
    React.useContext(StoreContext);

  const [accounts, setAccounts] = accountContext;
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (accounts.length < 0) {
      setDataSelect([]);
      return;
    }

    // try {
    //   axios
    //     .get(
    //       `http://${window.location.hostname}:4000/addresses/identify/${accounts[0]}`
    //     )
    //     .then((response) => {
    //       setDataSelect(response.data);
    //     });
    // } catch (err) {
    //   console.error(err);
    // }
  }, [accounts]);

  React.useEffect(() => {
    setData({
      labels: eachAddress,
      datasets: [
        {
          label: "Balance",
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
  }, [balance, eachAddress, eachBalance, eachTransaction]);

  const handleChange = (event: SelectChangeEvent<typeof dataSelected>) => {
    setLoading(true);
    let catchValue = event.target.value;
    let id = catchValue.split("&")[0];
    setDataSelected(catchValue);

    async function fetchData() {
      let sumBalance = 0;
      let sumActiveBalance = 0;
      let arrAddress = [];
      let arrTransactionCount = [];
      let arrBalance = [];
      const groupAddress = await axios.get(
        `http://${window.location.hostname}:4000/identifies/addresses/${id}`
      );

      for (let element of groupAddress.data) {
        let balanceAddress = await web3.eth.getBalance(element.address);
        sumBalance += Number(balanceAddress);
        if (element.isVerify) {
          sumActiveBalance += Number(balanceAddress);
        }
      }
      setBalance([sumActiveBalance / 10 ** 18, sumBalance / 10 ** 18]);

      for (let element of groupAddress.data) {
        arrAddress.push(element.address);
        let transactionRoot = await web3.eth.getTransactionCount(
          element.address
        );
        // setEachTransaction([...eachTransaction, transactionRoot]);
        arrTransactionCount.push(Number(transactionRoot));
        let balanceRoot = await web3.eth.getBalance(element.address);
        // setEachBalance([...eachBalance, balanceRoot]);
        arrBalance.push(Number(balanceRoot) / 10 ** 18);
      }

      setEachAddress(arrAddress);
      setEachTransaction(arrTransactionCount);
      setEachBalance(arrBalance);
    }

    fetchData().then(() => setLoading(false));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <Grid container spacing={2} direction="row" alignItems="center">
      <Grid item xs={12}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" alignItems="center" spacing={4}>
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
            {loading && (
              <Box sx={{ display: "flex" }}>
                <CircularProgress />
              </Box>
            )}
          </Stack>
          <Stack direction="row" spacing={4}>
            <Typography variant="h5" component="h2">
              Total:{" "}
              {`${balance[0].toPrecision(5)} / ${balance[1].toPrecision(5)}`}{" "}
              ETH
            </Typography>
            <Typography variant="h5" component="h2">
              Credit Score: 500
            </Typography>
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Bar options={options} data={data} />
      </Grid>
    </Grid>
  );
}

import * as React from "react";
import Stack from "@mui/material/Stack";
import Fab from "@mui/material/Fab";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import Snackbar from "@mui/material/Snackbar";
import {
  Box,
  Button,
  Divider,
  Grow,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { StoreContext } from "../store";
import Web3 from "web3";
import { abi } from "../contracts/ChainIdentification";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Switch from "@mui/material/Switch";
import LoadingButton from "@mui/lab/LoadingButton";
import PublishIcon from "@mui/icons-material/Publish";
import NavigationIcon from "@mui/icons-material/Navigation";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";
import PreviewIcon from "@mui/icons-material/Preview";
import PageviewIcon from "@mui/icons-material/Pageview";
import ClearIcon from "@mui/icons-material/Clear";
import { addressContract } from "../contracts/AddressContract";

const mapping = {
  "0x01": "Mainnet",
  "0x03": "Ropsten",
  "0x04": "Rinkeby",
  "0x05": "Goerli",
  "0x2a": "Kovan",
  "0x38": "BSC",
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const initContract = (addr: string) =>
  new web3.eth.Contract(abi as any[], addr);

export default function Import(props: {
  item: {
    name: string;
    address: string;
    active: boolean;
  }[];
}) {
  const myContract = initContract(addressContract);
  const { messageContext, accountContext, addressContext, signatureContext } =
    React.useContext(StoreContext);
  const [accounts, setAccounts] = accountContext;
  const [address, setAddress] = addressContext;
  const [signature, setSignature] = signatureContext;
  const [isVerify, setIsVerify] = React.useState(false);
  const [message, setMessage] = messageContext;
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingVerify, setLoadingVerify] = React.useState(false);
  const [nameIdentify, setNameIdentify] = React.useState("");
  const [combineId, setCombineId] = React.useState<number>();

  const handleVerify = async () => {
    setLoadingVerify(true);

    const data_addr = [];
    address.forEach((item: string) => {
      data_addr.push(item);
    });
    const data_sign = [];
    signature.forEach((item: any) => {
      data_sign.push(item);
    });

    if (
      data_addr.length > data_sign.length ||
      address.size == 0 ||
      signature.size == 0
    ) {
      setIsVerify(false);
      setOpen(true);
      setLoadingVerify(false);
      return;
    }

    const result = await myContract.methods
      .verifyPayload(Date.now(), data_addr, data_sign, message)
      .call();

    if (result) {
      axios.get("https://randomuser.me/api/").then((response) => {
        let nameResponse = response.data.results[0].name;
        setNameIdentify(nameResponse.last + " " + nameResponse.first);
      });
    }

    setIsVerify(result);
    setLoadingVerify(false);
    setOpen(true);
  };

  const handleTransaction = async () => {
    setLoading(true);

    const data_addr = [];
    address.forEach((item: string) => {
      data_addr.push(item);
    });
    const data_sign = [];
    signature.forEach((item: any) => {
      data_sign.push(item);
    });

    if (
      data_addr.length > data_sign.length ||
      address.size == 0 ||
      signature.size == 0 ||
      accounts.length == 0
    ) {
      setLoading(false);
      setIsVerify(false);
      setOpen(true);
      return;
    }

    try {
      if (combineId != null && combineId > 0) {
        const resultValue = await myContract.methods
          .insertPayload(Date.now(), data_addr, data_sign, message, combineId)
          .send({ from: accounts[0] });

        const resultId =
          resultValue.events.TransactionComplete.returnValues.random;
        const result: boolean = resultId > 0;

        setIsVerify(result);
        setLoading(false);
        setOpen(true);

        if (result) {
          let setOfAddresses = address.values();
          let setOfSignature = signature.values();
          for (let i = 0; i < address.size; i++) {
            let signature = setOfSignature.next().value;
            let dataAddress = setOfAddresses.next().value;
            axios.post(
              `http://${window.location.hostname}:4000/identifies/address/${combineId}`,
              {
                id: uuidv4(),
                message: message,
                address: "0x" + dataAddress.slice(4),
                signature: signature,
                infuralNetworks: mapping[dataAddress.slice(0, 4)],
                isVerify: true,
                identifyId: null,
              }
            );
          }
        }
      } else {
        const resultValue = await myContract.methods
          .verifyPayload(Date.now(), data_addr, data_sign, message)
          .send({ from: accounts[0] });
        const resultId =
          resultValue.events.TransactionComplete.returnValues.random;
        const result: boolean = resultId > 0;

        setIsVerify(result);
        setLoading(false);
        setOpen(true);

        if (result) {
          const identifyId: string = uuidv4();

          const sumBalance = await myContract.methods
            .sumBalance(resultId)
            .call();
          await axios.post(
            `http://${window.location.hostname}:4000/identifies`,
            {
              id: identifyId,
              title: nameIdentify,
              message: message,
              combineId: resultId,
              balance: sumBalance,
            }
          );

          let operatingSystem = "Unknown OS";
          if (navigator.userAgent.indexOf("Mac") != -1) {
            operatingSystem = "MacOS";
          }
          if (navigator.userAgent.indexOf("Win") != -1) {
            operatingSystem = "Windows";
          }
          if (navigator.userAgent.indexOf("Linux") != -1) {
            operatingSystem = "Linux";
          }
          const internetProtocol = await axios.get("https://api.ipify.org/");

          await axios.post(`http://${window.location.hostname}:4000/users`, {
            id: uuidv4(),
            operatingSystem: operatingSystem,
            internetProtocol: internetProtocol.data,
            isActive: true,
            identifyId: identifyId,
          });

          let setOfAddresses = address.values();
          let setOfSignature = signature.values();
          for (let i = 0; i < address.size; i++) {
            let signature = setOfSignature.next().value;
            let dataAddress = setOfAddresses.next().value;
            axios.post(`http://${window.location.hostname}:4000/addresses`, {
              id: uuidv4(),
              message: message,
              address: "0x" + dataAddress.slice(4),
              signature: signature,
              infuralNetworks: mapping[dataAddress.slice(0, 4)],
              isVerify: true,
              identifyId: identifyId,
            });
          }
        }
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const clearAccount = (address_: string) => {
    let location = 0,
      i = 0;
    address.forEach((item: string, index: number) => {
      i++;
      if (item.indexOf(address_) != -1) {
        address.delete(item);
        let addressUpdate = new Set(address);
        setAddress(addressUpdate);
        location = i;
      }
      signature.forEach((item: string, index: number) => {
        location--;
        if (location == 0) {
          signature.delete(item);
          let signatureUpdate = new Set(signature);
          setSignature(signatureUpdate);
        }
      });
      if (address.size == 0 || signature.size == 0) {
        setCombineId(null);
        setIsVerify(false);
        setSignature(new Set());
        setOpen(false);
      }
    });
  };

  const handleCombineId = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCombineId(Number(event.target.value));
  };

  return (
    <>
      <Stack direction="row" spacing={3} justifyContent={"flex-start"}>
        <Stack direction="column">
          <Typography
            variant="body1"
            my={0.5}
            style={{ fontWeight: 600 }}
            sx={{ color: "#673ab7" }}
          >
            NETWORK
          </Typography>
          {props.item.map((it, index) => (
            <Typography
              key={index}
              variant="body1"
              my={1}
              style={{ fontWeight: 600 }}
            >
              {mapping[it.name]}
            </Typography>
          ))}
        </Stack>
        <Stack direction="column">
          <Typography
            variant="body1"
            my={0.5}
            style={{ fontWeight: 600 }}
            sx={{ color: "#673ab7" }}
          >
            ADDRESS
          </Typography>
          {props.item.map((it, index) => (
            <Typography
              key={index}
              variant="body1"
              my={1}
              style={{ fontWeight: 600 }}
            >
              {"0x" + it.address.substring(0)}
            </Typography>
          ))}
        </Stack>
        <Stack direction="column">
          <Typography
            variant="body1"
            my={0.5}
            style={{ fontWeight: 600 }}
            sx={{ color: "#673ab7" }}
          >
            DETAIL
          </Typography>
          {props.item.map((it, index) => (
            <IconButton
              onClick={() =>
                window.open(
                  `https://ropsten.etherscan.io/address/${it.address}`
                )
              }
              key={index}
              size="medium"
              color="primary"
              component="span"
            >
              <PageviewIcon />
            </IconButton>
          ))}
        </Stack>
        <Stack direction="column">
          <Typography
            variant="body1"
            my={0.5}
            style={{ fontWeight: 600 }}
            sx={{ color: "#673ab7" }}
          >
            CLEAR
          </Typography>
          {props.item.map((it, index) => (
            <IconButton
              onClick={() => clearAccount(it.address)}
              key={index}
              size="medium"
              color="primary"
              component="span"
            >
              <ClearIcon />
            </IconButton>
          ))}
        </Stack>
      </Stack>
      <Box sx={{ "& > :not(style)": { my: 1 } }}>
        <Divider />
        <LoadingButton
          variant="contained"
          startIcon={<DoneAllIcon />}
          onClick={handleVerify}
          loading={loadingVerify}
          loadingPosition="start"
        >
          Verify all account
        </LoadingButton>
      </Box>
      <Grow in={isVerify}>
        <Stack
          direction="row"
          spacing={2}
          justifyContent={"flex-start"}
          alignItems="center"
          sx={{ mt: 1 }}
        >
          <Stack direction="column">
            <TextField
              id="outlined-read-only-input"
              label="Name"
              value={nameIdentify}
              sx={{ my: 1, width: "50ch" }}
              InputProps={{
                readOnly: true,
              }}
            />
          </Stack>
          <Stack direction="column">
            <TextField
              onChange={handleCombineId}
              id="outlined-number"
              label="Key"
              type="number"
              sx={{ my: 1, width: "10ch" }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Stack>
          <Stack direction="column">
            <LoadingButton
              onClick={handleTransaction}
              startIcon={<PublishIcon />}
              loading={loading}
              loadingPosition="start"
              variant="contained"
              color="secondary"
              sx={{ my: 1, height: 52 }}
            >
              Send
            </LoadingButton>
          </Stack>
        </Stack>
      </Grow>

      {isVerify && (
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Verify success!
          </Alert>
        </Snackbar>
      )}
      {!isVerify && (
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            Verify failed!
          </Alert>
        </Snackbar>
      )}
    </>
  );
}

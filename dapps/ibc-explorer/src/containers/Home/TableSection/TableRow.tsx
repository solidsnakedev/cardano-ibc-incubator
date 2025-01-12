import { Box, Link, TableCell, Typography } from '@mui/material';
import { COLOR } from '@src/styles/color';
import { TransactionType } from '@src/types/transaction';
import { formatUnixTimestamp, truncateString } from '@src/utils/string';
import { TX_STATUS } from '@src/constants';
import { useHistory } from 'react-router-dom';
import {
  CARDANO_MAINNET_MAGIC,
  chainsMapping,
} from '@src/configs/customChainInfo';
import { paymentCredToAddress } from '@src/utils/helper';

import { StyledContentTableRow } from './index.style';

type TableRowItemProps = {
  rowData: TransactionType;
};

export const TableRowItem = ({ rowData }: TableRowItemProps) => {
  const history = useHistory();

  const getStatusColor = () => {
    switch (rowData.status) {
      case TX_STATUS.FAILED:
        return COLOR.error;
      case TX_STATUS.PROCESSING:
        return COLOR.warning;
      case TX_STATUS.SUCCESS:
        return COLOR.success;
      default:
        return COLOR.error;
    }
  };

  const handleClick = (
    event: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
  ) => {
    event.preventDefault();
    history.push(`tx/${rowData.fromTxHash}`);
  };
  const chainData = chainsMapping?.[rowData.fromChainId] || {};
  const chainName = chainData?.pretty_name || rowData.fromChainId;
  const chainLogo = chainData?.logo_URIs?.svg;
  return (
    <StyledContentTableRow key={rowData.fromTxHash} onClick={handleClick}>
      <TableCell>
        <Link href={`/tx/${rowData.fromTxHash}`} underline="hover">
          <Typography>{truncateString(rowData.fromTxHash, 4, 4)}</Typography>
        </Link>
      </TableCell>
      <TableCell>
        <Typography>
          {truncateString(
            paymentCredToAddress(
              rowData.fromAddress,
              process.env.REACT_APP_CARDANO_CHAIN_ID === CARDANO_MAINNET_MAGIC,
            ),
            6,
            6,
          )}
        </Typography>
      </TableCell>
      <TableCell>
        <Box>
          <Box display="flex" alignItems="center" gap={2}>
            <img width={24} height={24} src={chainLogo} alt={chainName} />
            {chainName}
          </Box>
        </Box>
      </TableCell>
      <TableCell width={100}>
        <Box>
          <Typography
            color={getStatusColor()}
            sx={{ textTransform: 'capitalize' }}
          >
            {rowData.status}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Typography>
          {truncateString(
            paymentCredToAddress(
              rowData.toAddress,
              process.env.REACT_APP_CARDANO_CHAIN_ID === CARDANO_MAINNET_MAGIC,
            ),
            6,
            6,
          )}
        </Typography>
      </TableCell>
      <TableCell width={100}>
        {rowData.toTxHash?.length ? (
          <Link
            href={`/tx/${rowData.toTxHash || rowData.fromTxHash}`}
            underline="hover"
          >
            <Typography>{truncateString(rowData.toTxHash, 4, 4)}</Typography>
          </Link>
        ) : (
          <Typography>--</Typography>
        )}
      </TableCell>
      <TableCell width={120}>
        <Typography>{formatUnixTimestamp(rowData.createTime, true)}</Typography>
      </TableCell>
      <TableCell width={120}>
        <Typography>{formatUnixTimestamp(rowData.endTime, true)}</Typography>
      </TableCell>
    </StyledContentTableRow>
  );
};

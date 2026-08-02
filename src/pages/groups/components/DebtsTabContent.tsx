import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import type { DebtGroupSummaryResponse, MyDebtsResponse, DebtUserInfo } from '@/services/debtService';

interface DebtsTabContentProps {
  debtsSummary?: DebtGroupSummaryResponse;
  myDebts?: MyDebtsResponse;
  onOpenSettleModal: (debtId: number, amount: number) => void;
}

const getUserDisplayName = (u?: DebtUserInfo, fallbackId?: number, fallbackName?: string): string => {
  if (u?.username) return u.username;
  if (u?.fullname) return u.fullname;
  if (fallbackName) return fallbackName;
  if (fallbackId) return `User #${fallbackId}`;
  return 'Thành viên';
};

export const DebtsTabContent: React.FC<DebtsTabContentProps> = ({
  debtsSummary,
  myDebts,
  onOpenSettleModal,
}) => {
  const pairs = debtsSummary?.pairs || [];
  const iOweList = myDebts?.iOwe || [];
  const owedToMeList = myDebts?.owedToMe || [];

  return (
    <Box sx={{ px: 3, pb: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Aggregated Pair Summary */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1.5 }}>
          Bảng Tổng Hợp Công Nợ ("Ai Nợ Ai")
        </Typography>

        {pairs.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 44, mb: 1 }} />
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Tất cả thành viên đã cân bằng tài chính! Không có công nợ.
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            {pairs.map((pair, pIdx) => {
              const fromName = getUserDisplayName(pair.fromUser, pair.fromUserId, pair.fromUsername);
              const toName = getUserDisplayName(pair.toUser, pair.toUserId, pair.toUsername);
              return (
                <Paper
                  key={pIdx}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flexWrap: 'wrap' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {fromName}
                    </Typography>
                    <ArrowForwardIcon fontSize="small" color="action" />
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold', mr: 1 }}>
                      {toName}
                    </Typography>
                  </Box>

                  <Typography
                    variant="subtitle1"
                    color="error.main"
                    sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', ml: 'auto', pl: 1 }}
                  >
                    {(pair.totalOwed || 0).toLocaleString('vi-VN')} {pair.currency?.acronym || pair.currency?.code || pair.currencyCode || 'VNĐ'}
                  </Typography>
                </Paper>
              );
            })}
          </Box>
        )}
      </Box>

      {/* My Personal Debts */}
      {myDebts && (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1.5 }}>
            Công Nợ Cá Nhân Của Tôi
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            {/* I Owe */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, bgcolor: 'action.hover' }}>
              <Typography variant="subtitle2" color="error.main" sx={{ fontWeight: 'bold', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountBalanceWalletIcon fontSize="small" />
                Tôi Nợ Người Khác ({iOweList.length})
              </Typography>

              {iOweList.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Bạn không nợ ai trong nhóm này.
                </Typography>
              ) : (
                iOweList.map((groupItem, idx) => {
                  const toName = getUserDisplayName(groupItem.toUser);
                  const debts = groupItem.debts || [];

                  return (
                    <Box key={idx} sx={{ mb: 1.5, p: 1.5, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2">
                          Nợ <strong>{toName}</strong>: <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>{(groupItem.totalAmount || 0).toLocaleString()} đ</span>
                        </Typography>
                      </Box>

                      {/* Sub-debts detail if available */}
                      {debts.length > 0 ? (
                        debts.length === 1 ? (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              Khoản nợ #{debts[0].id} {debts[0].expenseId ? `(Expense #${debts[0].expenseId})` : ''}
                            </Typography>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => onOpenSettleModal(debts[0].id, debts[0].amount)}
                            >
                              Tất toán
                            </Button>
                          </Box>
                        ) : (
                          <Accordion elevation={0} sx={{ bgcolor: 'transparent', '&:before': { display: 'none' } }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0, minHeight: 32 }}>
                              <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
                                Xem {debts.length} khoản nợ chi tiết
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 0, pt: 0 }}>
                              {debts.map((sub) => (
                                <Box key={sub.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5, borderTop: '1px dashed', borderColor: 'divider' }}>
                                  <Typography variant="caption">
                                    Nợ #{sub.id}: {sub.amount.toLocaleString()} đ
                                  </Typography>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="success"
                                    sx={{ py: 0, px: 1, minWidth: 'auto', fontSize: '0.75rem' }}
                                    onClick={() => onOpenSettleModal(sub.id, sub.amount)}
                                  >
                                    Trả khoản này
                                  </Button>
                                </Box>
                              ))}
                            </AccordionDetails>
                          </Accordion>
                        )
                      ) : null}
                    </Box>
                  );
                })
              )}
            </Paper>

            {/* Owed To Me */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, bgcolor: 'action.hover' }}>
              <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 'bold', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountBalanceWalletIcon fontSize="small" />
                Người Khác Nợ Tôi ({owedToMeList.length})
              </Typography>

              {owedToMeList.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Không ai nợ bạn trong nhóm này.
                </Typography>
              ) : (
                owedToMeList.map((groupItem, idx) => {
                  const fromName = getUserDisplayName(groupItem.fromUser);
                  const debts = groupItem.debts || [];

                  return (
                    <Box key={idx} sx={{ mb: 1.5, p: 1.5, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">
                          <strong>{fromName}</strong> nợ bạn: <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>{(groupItem.totalAmount || 0).toLocaleString()} đ</span>
                        </Typography>
                        <Chip label={`${debts.length} khoản chờ`} color="warning" size="small" />
                      </Box>
                    </Box>
                  );
                })
              )}
            </Paper>
          </Box>
        </Box>
      )}
    </Box>
  );
};

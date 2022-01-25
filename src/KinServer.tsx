import { useState, useEffect } from 'react';

import { KinAction } from './KinAction';
import { Links } from './Links';

import { kinLinks } from './constants';

import { MakeToast } from './helpers';
import {
  checkServerRunning,
  handleSetupKinClient,
  handleCreateAccount,
  handleGetBalance,
  handleRequestAirdrop,
  handleSendKin,
  handleGetTransaction,
  Transaction,
  HandleSendKin,
} from './kinServerHelpers';

import './Kin.scss';

interface KinServerAppProps {
  makeToast: (arg: MakeToast) => void;
  setLoading: (arg: boolean) => void;
}
export function KinServerApp({ makeToast, setLoading }: KinServerAppProps) {
  const [serverRunning, setServerRunning] = useState(false);
  const [serverAppIndex, setServerAppIndex] = useState(0);
  const [userAccounts, setUserAccounts] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<string[]>([]);
  const [shouldUpdate, setShouldUpdate] = useState(true);
  useEffect(() => {
    if (shouldUpdate) {
      checkServerRunning({
        onSuccess: ({ status, data }) => {
          setServerRunning(status === 200);
          setServerAppIndex(data.appIndex);
          setUserAccounts(data.users);
          setTransactions(data.transactions);
        },
        onFailure: () => setServerRunning(false),
      });

      setShouldUpdate(false);
    }

    return () => {};
  }, [shouldUpdate]);
  const [kinEnvironment, setKinEnvironment] = useState('Test');
  const [appIndex, setAppIndex] = useState('');

  const [newUserName, setNewUserName] = useState('');

  const [balanceUser, setBalanceUser] = useState('App');
  const [displayBalance, setDisplayBalance] = useState('');

  const [airdropUser, setAirdropUser] = useState('App');
  const [airdropAmount, setAirdropAmount] = useState('');

  const [inputTransaction, setInputTransaction] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState('');
  const [gotTransaction, setGotTransaction] = useState<Transaction | null>(
    null
  );

  const [payFromUserP2P, setPayFromUserP2P] = useState('');
  const [payToUserP2P, setPayToUserP2P] = useState('');
  const [payAmountP2P, setPayAmountP2P] = useState('');

  const [payFromUserSpend, setPayFromUserSpend] = useState('');
  const [payAmountSpend, setPayAmountSpend] = useState('');

  const [payToUserEarn, setPayToUserEarn] = useState('');
  const [payAmountEarn, setPayAmountEarn] = useState('');

  return (
    <div className="Kin">
      <div className={`Kin-status ${serverRunning ? 'up' : 'down'}`}>
        {serverRunning ? (
          <span>
            Server Running{' '}
            {serverAppIndex ? (
              <>
                <br />
                App Index {serverAppIndex}
              </>
            ) : (
              <>
                <br />
                <span>
                  {`Register on the Kin Developer Portal to get your App Index`}
                </span>
              </>
            )}
          </span>
        ) : (
          <span>
            {`Server not running`}
            <br />
            <Links
              links={kinLinks.serverRepos}
              linksTitle="Example Servers: "
            />
          </span>
        )}
      </div>

      {serverRunning ? (
        <>
          <KinAction
            open
            title="Initialise your Kin Client on the Server with your App Index"
            subTitleLinks={kinLinks.devPortal}
            linksTitle={kinLinks.title}
            links={kinLinks.setupClient}
            actionName="Setup"
            action={() => {
              setLoading(true);
              handleSetupKinClient({
                onSuccess: () => {
                  setLoading(false);
                  makeToast({
                    text: `Connected to App Index ${appIndex}!`,
                    happy: true,
                  });
                  setShouldUpdate(true);
                },
                onFailure: (error) => {
                  setLoading(false);
                  makeToast({
                    text: `Couldn't connect to App Index ${serverAppIndex}!`,
                    happy: false,
                  });
                  console.log(error);
                },
                kinEnvironment,
                appIndex,
              });
            }}
            inputs={[
              {
                name: 'Environment',
                value: kinEnvironment,
                options: ['Test', 'Prod'],
                onChange: setKinEnvironment,
              },
              {
                name: 'App Index',
                value: appIndex,
                type: 'number',
                onChange: setAppIndex,
              },
            ]}
            disabled={!appIndex}
          />

          <br />
          <hr />

          <h4 className="Kin-section">{`SDK Actions that don't require registering your App Index:`}</h4>
          <KinAction
            title="Create a Kin Account for your User"
            linksTitle={kinLinks.title}
            links={kinLinks.createAccount}
            actionName="Create"
            action={() => {
              setLoading(true);
              handleCreateAccount({
                name: newUserName,
                onSuccess: () => {
                  setLoading(false);
                  makeToast({
                    text: 'Account Creation Successful!',
                    happy: true,
                  });
                  setShouldUpdate(true);
                  setNewUserName('');
                },
                onFailure: (error) => {
                  setLoading(false);
                  makeToast({
                    text: 'Account Creation Failed!',
                    happy: false,
                  });
                  console.log(error);
                },
              });
            }}
            inputs={[
              {
                name: 'Username',
                value: newUserName,
                onChange: setNewUserName,
              },
            ]}
          />
          <KinAction
            title="Get Account Balance"
            linksTitle={kinLinks.title}
            links={kinLinks.getBalance}
            actionName="Get"
            action={() => {
              setLoading(true);
              handleGetBalance({
                user: balanceUser,
                onSuccess: (balance) => {
                  setLoading(false);
                  setDisplayBalance(balance.toString());
                },
                onFailure: (error) => {
                  setLoading(false);
                  console.log(error);
                },
              });
            }}
            inputs={[
              {
                name: 'User',
                value: balanceUser,
                options: ['App', ...userAccounts],
                onChange: (user) => {
                  setBalanceUser(user);
                  setDisplayBalance('');
                },
              },
            ]}
            displayValue={
              displayBalance ? `${balanceUser} has ${displayBalance} Kin` : ''
            }
          />

          {kinEnvironment === 'Test' ? (
            <KinAction
              title="Request Airdrop (Test Network Only)"
              subTitle="Get some kin so you can start testing your transaction code"
              linksTitle={kinLinks.title}
              links={kinLinks.requestAirdrop}
              actionName="Request"
              action={() => {
                setLoading(true);
                handleRequestAirdrop({
                  to: airdropUser,
                  amount: airdropAmount,
                  onSuccess: () => {
                    setLoading(false);
                    makeToast({ text: 'Airdrop Successful!', happy: true });
                    setShouldUpdate(true);
                    setAirdropAmount('');
                  },
                  onFailure: (error) => {
                    setLoading(false);
                    makeToast({ text: 'Airdrop Failed!', happy: false });
                    console.log(error);
                  },
                });
              }}
              inputs={[
                {
                  name: 'User',
                  value: airdropUser,
                  options: ['App', ...userAccounts],
                  onChange: (user) => {
                    setAirdropUser(user);
                  },
                },
                {
                  name: 'Requested Amount',
                  value: airdropAmount,
                  type: 'number',
                  onChange: setAirdropAmount,
                },
              ]}
            />
          ) : null}

          <KinAction
            title="Get Transaction Details"
            subTitle="Transactions may take a little time to appear"
            linksTitle={kinLinks.title}
            links={kinLinks.getTransaction}
            actionName="Get"
            action={() => {
              setLoading(true);
              handleGetTransaction({
                transaction:
                  inputTransaction || selectedTransaction || transactions[0],
                onSuccess: (transaction) => {
                  setLoading(false);
                  makeToast({ text: 'Got Transaction Data!', happy: true });
                  setGotTransaction(transaction);
                },
                onFailure: (error) => {
                  setLoading(false);
                  setGotTransaction(null);
                  makeToast({
                    text: "Couldn't get Transaction data!",
                    happy: false,
                  });
                  console.log(error);
                },
              });
            }}
            inputs={[
              {
                name: 'Transaction Id',
                value: inputTransaction,
                onChange: (transaction) => {
                  setInputTransaction(transaction);
                  setGotTransaction(null);
                },
              },
              {
                name: 'Transaction',
                value: selectedTransaction || transactions[0],
                options: [...transactions],
                onChange: (transaction) => {
                  setSelectedTransaction(transaction);
                  setInputTransaction('');
                  setGotTransaction(null);
                },
                disabledInput:
                  !transactions.length || !!inputTransaction.length,
              },
            ]}
            displayOutput={gotTransaction ? gotTransaction : null}
          />

          <br />
          <hr />

          <h4 className="Kin-section">{`These SDK Actions require registering your App Index so you can take advantage of the KRE:`}</h4>
          <p className="KRELinks">
            <Links links={kinLinks.KRE} darkMode />
          </p>

          {(() => {
            if (!serverAppIndex && !userAccounts.length) {
              return (
                <h4>Why not register your App Index and add some users?</h4>
              );
            }
            if (!serverAppIndex) {
              return <h4>Why not register your App Index?</h4>;
            }
            if (!userAccounts.length) {
              return <h4>Why not add some users?</h4>;
            }

            return null;
          })()}

          <KinAction
            title="Pay Kin from App To User - Earn Transaction"
            linksTitle={kinLinks.title}
            links={kinLinks.submitPayment}
            actionName="Pay"
            action={() => {
              setLoading(true);

              const sendKinOptions: HandleSendKin = {
                from: 'App',
                to: payToUserEarn || userAccounts[0],
                amount: payAmountEarn,

                type: 'Earn',
                onSuccess: () => {
                  setLoading(false);
                  makeToast({ text: 'Send Successful!', happy: true });
                  setPayAmountEarn('');

                  setShouldUpdate(true);
                },
                onFailure: (error: string) => {
                  setLoading(false);
                  makeToast({ text: 'Send Failed!', happy: false });
                  console.log(error);
                },
              };

              handleSendKin(sendKinOptions);
            }}
            inputs={[
              {
                name: 'To',
                value: payToUserEarn || userAccounts[0],
                options: userAccounts,
                onChange: (user) => {
                  setPayToUserEarn(user);
                },
              },
              {
                name: 'Amount to Pay',
                value: payAmountEarn,
                type: 'number',
                onChange: setPayAmountEarn,
              },
            ]}
            disabled={!serverAppIndex}
          />
          <KinAction
            title="Pay Kin from User To App - Spend Transaction"
            linksTitle={kinLinks.title}
            links={kinLinks.submitPayment}
            subTitle="Requires 'sign_transaction' Webhook"
            actionName="Pay"
            action={() => {
              setLoading(true);

              const sendKinOptions: HandleSendKin = {
                from: payFromUserSpend || userAccounts[0],
                to: 'App',
                amount: payAmountSpend,
                type: 'Spend',
                onSuccess: () => {
                  setLoading(false);
                  makeToast({ text: 'Send Successful!', happy: true });
                  setPayAmountSpend('');
                  setShouldUpdate(true);
                },
                onFailure: (error: string) => {
                  setLoading(false);
                  makeToast({ text: 'Send Failed!', happy: false });
                  console.log(error);
                },
              };

              handleSendKin(sendKinOptions);
            }}
            inputs={[
              {
                name: 'From',
                value: payFromUserSpend || userAccounts[0],
                options: userAccounts,
                onChange: (user) => {
                  setPayFromUserSpend(user);
                },
              },
              {
                name: 'Amount to Pay',
                value: payAmountSpend,
                type: 'number',
                onChange: setPayAmountSpend,
              },
            ]}
            disabled={!serverAppIndex}
          />
          <KinAction
            title="Send Kin from User to User -  P2P Transaction"
            linksTitle={kinLinks.title}
            links={kinLinks.submitPayment}
            subTitle="Requires 'sign_transaction' Webhook"
            actionName="Send"
            action={() => {
              setLoading(true);

              const sendKinOptions: HandleSendKin = {
                from: payFromUserP2P || userAccounts[0],
                to: payToUserP2P || userAccounts[0],
                amount: payAmountP2P,
                type: 'P2P',
                onSuccess: () => {
                  setLoading(false);
                  makeToast({ text: 'Send Successful!', happy: true });
                  setPayAmountP2P('');
                  setShouldUpdate(true);
                },
                onFailure: (error: string) => {
                  setLoading(false);
                  makeToast({ text: 'Send Failed!', happy: false });
                  console.log(error);
                },
              };

              handleSendKin(sendKinOptions);
            }}
            inputs={[
              {
                name: 'From',
                value: payFromUserP2P || userAccounts[0],
                options: userAccounts,
                onChange: (user) => {
                  setPayFromUserP2P(user);
                },
              },
              {
                name: 'To',
                value: payToUserP2P || userAccounts[0],
                options: userAccounts,
                onChange: (user) => {
                  setPayToUserP2P(user);
                },
              },
              {
                name: 'Amount to Send',
                value: payAmountP2P,
                type: 'number',
                onChange: setPayAmountP2P,
              },
            ]}
            disabled={!serverAppIndex || payFromUserP2P === payToUserP2P}
          />
          <br />
          <hr />
        </>
      ) : null}
    </div>
  );
}

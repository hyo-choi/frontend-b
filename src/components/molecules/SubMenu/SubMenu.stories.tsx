import React from 'react';
import { Meta } from '@storybook/react';
import { BrowserRouter, Route, RouteComponentProps } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import SubMenu from './SubMenu';
import ContextProvider from '~hooks/useContext';
import MainTemplate from '../../templates/MainTemplate/MainTemplate';
import List from '~components/atoms/List/List';
import { FriendList, OneChat } from '~components/atoms/ListItem/ListItem.stories';

export default {
  component: SubMenu,
  title: 'molecules/SubMenu',
} as Meta;

export const Default = () => (
  <BrowserRouter>
    <ContextProvider>
      <Route
        path={['/community/:name', '/:name']}
        render={({ match }: RouteComponentProps<{ name: string }>) => (
          <SubMenu
            current={`/community/${match.params.name}`}
            list={[
              {
                name: 'ALL USERS',
                link: '/community/all',
              },
              {
                name: 'FRIENDS LIST',
                link: '/community/friends',
              },
              {
                name: 'BLOCKED USER',
                link: '/community/blocked',
              },
            ]}
          />
        )}
      />
    </ContextProvider>
  </BrowserRouter>
);

export const ChannelMenu = () => (
  <BrowserRouter>
    <ContextProvider>
      <Route
        path="/:name"
        render={({ match }: RouteComponentProps<{ name: string }>) => (
          <SubMenu
            current={`/${match.params.name}`}
            list={[
              {
                name: 'MY CHANNEL',
                link: '/mychannel',
              },
              {
                name: 'ALL CHANNEL',
                link: '/all',
              },
            ]}
          />
        )}
      />
    </ContextProvider>
  </BrowserRouter>
);

export const InMainTemplate = () => (
  <BrowserRouter>
    <ContextProvider>
      <MainTemplate
        main={(
          <Grid container flex-direction="column">
            <Grid container justifyContent="center">
              <Route
                path={['/community/:name', '/:name']}
                render={({ match }: RouteComponentProps<{ name: string }>) => (
                  <SubMenu
                    current={`/community/${match.params.name}`}
                    list={[
                      {
                        name: 'ALL USERS',
                        link: '/community/all',
                      },
                      {
                        name: 'FRIENDS LIST',
                        link: '/community/friends',
                      },
                      {
                        name: 'BLOCKED USER',
                        link: '/community/blocked',
                      },
                    ]}
                  />
                )}
              />
            </Grid>
            <Grid item container>
              <List height="80vh">
                <FriendList />
                <FriendList />
                <FriendList />
              </List>
            </Grid>
          </Grid>
      )}
        chat={(
          <List height="80vh" scroll>
            <OneChat />
            <OneChat />
            <OneChat />
            <OneChat />
            <OneChat />
            <OneChat />
            <OneChat />
            <OneChat />
            <OneChat />
            <OneChat />
          </List>
      )}
      />
    </ContextProvider>
  </BrowserRouter>
);

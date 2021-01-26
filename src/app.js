import React,{ Component } from 'react'
import './app.less'
import 'taro-ui/dist/style/index.scss';
import dva, { connect } from 'remax-dva';
import global from './models/global';

const app = dva();
app.model(global);

const App = app.start(({ children }) => children);

export default App

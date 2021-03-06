import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import request from '../../request'
import qs from 'qs'
import { Form, Icon, Input, Button, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form'
import './style.css'

interface FormFields {
    username: string
    password: string
}
interface Props {
    form: WrappedFormUtils<FormFields>
}

class LoginForm extends Component<Props> {
    state = {
        isLogin: false
    }
    handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        this.props.form.validateFields((err: any, values) => {
            if (!err) {
                request.post('/api/login', qs.stringify({
                    username: values.username,
                    password: values.password
                }), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(res => {
                    const data: responseResult.login = res.data
                    if (data) {
                        this.setState({
                            isLogin: true
                        })
                        localStorage.setItem('TOKEN', data.toString())
                    } else {
                        message.error('登录失败')
                    }
                })
            }
        });
    };

    render() {
        const { isLogin } = this.state
        const { getFieldDecorator } = this.props.form;
        return (
            isLogin ? <Redirect to="/" /> :
                <div className="login-page">
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入用户名称' }],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="text"
                                    placeholder="Username"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入登陆密码' }],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Password"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit"> 登 陆 </Button>
                            <Link to="/register"><Button type="link">注册</Button></Link>
                        </Form.Item>
                    </Form>
                </div>
        );
    }
}

const WrappedLoginForm = Form.create({ name: 'login' })(LoginForm);

export default WrappedLoginForm
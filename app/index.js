/**
 * @Author: Oceanxy
 * @Email: xieyang@hiynn.com
 * @Description: dev
 * @Date: 2019-05-23 11:41:43
 * @LastModified: Oceanxy（xieyang@hiynn.com）
 * @LastModifiedTime: 2019-06-03 14:57:48
 */

import React from 'react'
import ReactDOM from 'react-dom'
import Tabllist from '../src'
import './index.scss'

const Dev = () => {
	const option = {
		data: [
			[
				'1st column',
				'2nd column',
				'3rd column',
				{
					type: 'select',
					text: '4rd column',
					data: 123,
					className: '',
					option: [
						{
							id: '1',
							label: 'Scroll to the 2nd row',
							value: 0
						},
						{
							id: '2',
							label: 'Scroll to the 5rd row',
							value: 1
						},
						{
							id: '3',
							label: 'Scroll to the 7rd row',
							value: 2
						}
					],
					event: 'onChange',
					callback: (restData, objectUnit, event) => {
						// step 1: Get the value of select
						const value = event.target.value
						// step 2: According to the value of select to match the value of the corresponding row in the data,
						// 				 and then get the index of the row
						const data = objectUnit.instanceObject.props.data
						for(let i = 0, k = data; i < k.length; i++) {
							if(_.isPlainObject(data[i]) && parseInt(data[i].value) === parseInt(value)) {
								// step 3: Call method scrolling list
								objectUnit.instanceObject.scrollTo(i - 1)
								break
							}
						}
					}
				}
			],
			[
				<span>I am span</span>,
				<div onClick={() => alert('test JSX event')}>test JSX event</div>,
				<a href='http://www.xieyangogo.cn/react-tabllist/'>I am link</a>,
				<div>I am div</div>
			],
			{
				type: 'row',
				data: 1,
				value: 0,
				event: 'onClick',
				callback: (restData, objectUnit, event) => {
					alert('test event of row')
					console.log(restData, objectUnit, event)
				},
				className: 'click-row',
				cells: [
					'row 1; column 1',
					{
						type: 'link',
						text: 'I am a first link',
						className: 'test-link',
						callback: () => {console.log('I am a first link')}
					},
					{
						type: 'link',
						text: 'I am a second link',
						href: 'https://github.com/oceanxy/react-tabllist',
						className: 'test-link'
					},
					{
						type: 'button',
						value: 'click me',
						className: 'test-btn',
						callback: () => {
							alert('hello react-tabllist')
						}
					}
				]
			},
			[
				'row 2; column 1', 'row 2; column 2',
				{
					type: 'link',
					text: 'I am a link',
					href: 'https://github.com/oceanxy/react-tabllist',
					className: 'test-link'
				},
				{
					type: 'button',
					value: 'click me',
					className: 'test-btn',
					callback: () => {
						alert('hello react-tabllist')
					}
				}
			],
			['row 3; column 1', 'row 3; column 2', 'row 3; column 3', 'row 3; column 4'],
			{
				type: 'row',
				data: 1,
				value: 1,
				event: 'onClick',
				callback: (restData, objectUnit, event) => {
					alert('test event of row')
					console.log(restData, objectUnit, event)
				},
				className: 'click-row',
				cells: [
					{
						type: 'link',
						text: 'I am a link',
						href: 'https://github.com/oceanxy/react-tabllist',
						className: 'test-link'
					},
					{
						type: 'button',
						value: 'click me',
						className: 'test-btn',
						callback: () => {
							alert('hello react-tabllist')
						}
					}, 'row 4; column 3', 'row 4; column 4'
				]
			},
			[
				[
					{
						type: 'radio',
						name: 'group1',
						text: 'radio group 1-1',
						className: 'test-radio'
					},
					{
						type: 'radio',
						name: 'group1',
						text: 'radio group 2-1',
						className: 'test-radio'
					}
				],
				'row 5; column 2',
				'row 5; column 3',
				'row 5; column 4'
			],
			{
				type: 'row',
				data: 1,
				value: 2,
				event: 'onClick',
				callback: (restData, objectUnit, event) => {
					alert('test event of row')
					console.log(restData, objectUnit, event)
				},
				className: 'click-row',
				cells: [
					[
						{
							type: 'radio',
							name: 'group2',
							text: 'radio group 2-1',
							className: 'test-radio'
						},
						{
							type: 'radio',
							name: 'group2',
							text: 'radio group 2-2',
							className: 'test-radio'
						}
					],
					'row 6; column 2',
					'row 6; column 3',
					'row 6; column 4'
				]
			},
			[
				[
					{
						type: 'checkbox',
						name: 'chkxxx',
						text: 'chk1'
					},
					{
						type: 'checkbox',
						name: 'chkxxx',
						text: 'chk2'
					},
					{
						type: 'checkbox',
						name: 'chkxxx',
						text: 'chk3'
					}
				],
				{
					type: 'link',
					text: 'I am a link',
					event: 'onClick',
					className: 'test-link',
					callback: () => {
						alert('clicked link')
					}
				},
				{
					type: 'button',
					value: 'click me',
					className: 'test-btn',
					callback: (data, cellObject, cellElement) => {
						if(!data) {
							data = 'data of button is undefined'
						}

						cellElement.target.value = 'you clicked me!!'
						cellElement.target.style.width = '150px'

						console.log(data)
						console.log(cellObject)
						console.log(cellElement)

						alert('hello react-tabllist, Please check the console')
					}
				}
			],
			['row 8; column 1', 'row 8; column 2', 'row 8; column 3', 'row 8; column 4'],
			['row 9; column 1', 'row 9; column 2', 'row 9; column 3', 'row 9; column 4']
		],
		property: {
			// The style of the outermost container
			style: {
				width: '100%',
				margin: '0 auto',
				height: 550,
				border: '1px solid #999999'
			},
			border: {
				borderWidth: 1,
				borderStyle: 'solid',
				borderColor: '#ededed'
			},
			header: {
				show: true,
				style: {
					backgroundColor: '#1693ff',
					height: 40,
					borderBottom: '1px solid #999999'
				},
				cellStyle: {
					color: '#ffffff',
					fontWeight: 'bolder',
					fontSize: 20
				}
			},
			body: {
				row: {
					rowCheckBox: true,
					onClick: () => {}, // 仅在1.2.0版本生效，此处用于测试控制台打印警告信息
					style: {
						height: 34
					},
					serialNumber: {
						show: true,
						formatter: 'No.{index}',
						style: {
							backgroundColor: '#3991ff',
							width: 80,
							fontSize: 20,
							color: '#2cff41'
						},
						specialStyle: [
							{
								backgroundColor: '#203d7b'
							},
							{
								backgroundColor: '#2f4c99'
							},
							{
								backgroundColor: '#3960c0'
							}
						]
					},
					specialStyle: [
						{ height: 60 },
						{ height: 40 },
						{ height: 80 },
						{ height: 100 },
						{ height: 50 },
						{ height: 80 }
					],
					visual: {
						show: true,
						style: {
							backgroundColor: '#e8f4fc'
						}
					},
					silent: {
						style: {
							backgroundColor: '#bcf0fc'
						}
					}
				},
				cell: {
					style: {
						fontSize: 16,
						minWidth: 50,
						color: '#000000',
						textAlign: 'center',
						border: '',
						width: [60, 60, '30%', '25%', '10%']
					}
				}
			},
			scroll: {
				enable: true,
				speed: 2000,
				distance: -1
			}
		}
	}

	return (
		<div className='container'>
			<Tabllist property={option.property} data={option.data} />
		</div>
	)
}

ReactDOM.render(
	<Dev />,
	document.getElementById('root')
)

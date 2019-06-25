/**
 * @Author: Oceanxy
 * @Email: xyzsyx@163.com
 * @Description: util
 * @Date: 2018-10-08 17:56:19
 * @LastModified: Oceanxy（xieyang@hiynn.com）
 * @LastModifiedTime: 2019-06-19 17:35:16
 */

import _ from 'lodash'
import { getWaringProperty } from './config'

/**
 * 从el元素向上选取第一个selector选择器匹配的元素
 * @param {Element} el DOM元素
 * @param {string} selector 选择器
 * @return {Element} 按照选择器筛选后的元素
 */
export function closest(el, selector) {
	if(el) {
		const matchesSelector = el.matches ||
			el.webkitMatchesSelector ||
			el.mozMatchesSelector ||
			el.msMatchesSelector

		while(el) {
			if(matchesSelector.call(el, selector)) {
				break
			}
			el = el.parentNode || el.parentElement
		}

		return el
	}

	return null
}

/**
 * 设置屏幕滚动区域可见高度
 * @param {object} props props
 * @param {=} listComponent 列表组件实例对象
 * @returns {*} 列表滚动区域可见高度
 */
export function getScrollHeight(props, listComponent) {
	const {
		header: { show, style },
		style: { height }
	} = props.property

	if(listComponent) {
		const { paddingTop, paddingBottom, borderTopWidth, borderBottomWidth } = getComputedStyle(listComponent, null)
		const result = parseInt(height) - parseInt(paddingTop) - parseInt(paddingBottom) - parseInt(borderTopWidth) - parseInt(borderBottomWidth)

		if(show) {
			return result - parseInt(style.height)
		}

		return result
	}

	// 如果启用了表头
	if(show) {
		return parseInt(height) - parseInt(style.height)
	}

	return parseInt(height)
}

/**
 * 将用户设置的每一列单元格宽度值解析为组件程序需要的值，同时处理不合法数据
 * @param {string|array|number} width props传入的宽度数据
 * @returns {*} 用于渲染每列单元格的宽度值
 */
export function setColWidth(width) {
	// 处理字符串形式的多列宽度数值
	if(Array.isArray(width)) {
		return width.map(o => (!o ? 'auto' : o))
	}

	// 处理字符串形式的多列宽度数值
	if(typeof width === 'string') {
		if(width.indexOf(',') >= 0) {
			return width.split(',').map(o => {
				if(o.indexOf('px') > -1) {
					return `${parseFloat(o)}px`
				} else if(o.indexOf('%') > -1) {
					return `${parseFloat(o)}%`
				} else if(o * 1) {
					return parseFloat(o)
				}
				return 'auto'
			})
		}
		if(width === 'avg') {
			return new Array(100).fill(1)
		}
	}

	return 'auto'
}

/**
 * 组件内部元素的事件处理
 * @param _objectUnit {object} 渲染组件结构的对象单元
 * @param _func {function} 内部逻辑函数
 * @param event event对象
 */
export function handleEvent([_objectUnit, _func], event) {
	event.stopPropagation()

	if(_func && _.isFunction(_func)) {
		_func(event)
	}

	// 开放方法
	_objectUnit = { ..._objectUnit, instanceObject: this }

	if(_objectUnit && _objectUnit.callback && _.isFunction(_objectUnit.callback)) {
		_objectUnit.callback(_objectUnit.data, _objectUnit, event)
	}
}

/**
 * 在控制台打印警告
 * @param property 用户的配置属性对象
 * @returns {*} 新的property
 */
export function waring(property) {
	const waringProperty = getWaringProperty()

	/**
	 * 检测指定key是否被用户定义
	 * @param discard 被定义的过时属性
	 * @param property 用户定义的整个配置对象
	 * @returns {{isExist: boolean}|{isExist: boolean, value: *}} isExist:是否使用了过时属性 value:过时属性的值
	 */
	function isKeyExists(discard, property) {
		if(!property || !discard) {
			return { isExist: false }
		}

		// 将传入的对象路径字符串拆分为数组
		const pathList = discard.split('.')
		// 如果使用了过时的属性，则这边变量用来保存用户设置的属性的值
		let value

		// 检测用户的配置对象是否存在警告
		for(let i = 1; i < pathList.length; i++) {
			if(typeof property[pathList[i]] === 'undefined') {
				return { isExist: false }
			}

			if(i === pathList.length - 1) {
				value = property[pathList[i]]
				property = pathList[i]
			} else {
				property = property[pathList[i]]
			}
		}

		return { isExist: true, value }
	}

	/**
	 * 将用户使用的过时key赋值到正确的key
	 * @param replacement 正确的key
	 * @param property 用户定义的整个配置对象
	 * @param valueOfDiscard 用户使用的过时key的值
	 */
	function createNewProperty(replacement, property, valueOfDiscard) {
		if(!replacement) {
			return
		}

		// 将传入的对象路径字符串拆分为数组
		const pathList = replacement.split('.')

		// 替换过时属性，同时配置相对应的属性（如果存在）
		for(let i = 1; i < pathList.length; i++) {
			if(i === pathList.length - 1) {
				property[pathList[i]] = valueOfDiscard
			} else {
				if(!property[pathList[i]] || _.isPlainObject(pathList[i])) {
					property[pathList[i]] = {}
				}

				property = property[pathList[i]]
			}
		}
	}

	waringProperty.map((_obj) => {
		const result = isKeyExists(_obj.discard, property)
		if(result.isExist) {
			createNewProperty(_obj.replacement, property, result.value)

			if(process.env.NODE_ENV === 'development') {
				if(_obj.warn) {
					console.warn(_obj.warn)
				} else {
					console.warn('Used obsolete configuration in React-tabllist')
				}
			}
		}
	})

	return property
}

/**
 * @desc 获取组件每次滚动的距离。
 - 如果值为正整数，单位为`像素`；
 - 为`0`，表示停用滚动，同`scroll.enable:false`；
 - 如果为负整数，则以行为单位进行滚动，行数等于该值的绝对值。
 - 如果为正小数，则向上取整。
 - 如果为负小数，则向下取整。
 - 如果为非数字或，则取`0`。
 * @param distanceConfig {number} 用户设置的滚动距离
 * @param rows {Array} 包含所有行的数组
 * @param counter {number} 当前可视区域第一行的索引
 * @returns {*} 处理后的滚动距离
 */
export function getScrollTop(distanceConfig, rows, counter) {
	if(this === 'switch') {
		if(!counter) {
			return 0
		}

		return rows[counter].offsetTop - rows[counter].parentElement.offsetTop
	} else {
		if(isNaN(distanceConfig)) {
			return 0
		} else {
			if(distanceConfig >= 0) {
				return Math.ceil(distanceConfig)
			}

			let nextRow = (counter + 1) * -distanceConfig

			// 当设置一次滚动多行后，如果某一次递增的索引大于了总行数，则直接返回父容器的高度
			// 即接下来的一次滚动直接滚动到主容器最后的位置
			if(nextRow > rows.length - 1) {
				return rows[0].parentElement.offsetHeight
			}

			return rows[nextRow].offsetTop - rows[0].offsetTop
		}
	}
}

/**
 * 获取下一次滚动的速度(px/ms)
 * @param targetScrollTop {number} 滚动目标值
 * @param scroll {object} 滚动容器对象
 * @returns {number}
 */
export function getSpeed(targetScrollTop, scroll) {
	const distance = targetScrollTop - scroll.scrollTop

	if(distance > 0) {
		return Math.ceil(distance / 30)
	} else if(distance < 0) {
		return Math.floor(distance / 30)
	}

	return 1
}

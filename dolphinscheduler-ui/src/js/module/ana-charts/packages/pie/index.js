/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import Base from '../base'
import { checkKeyInModel, init } from '../../common'

const TYPE = 'pie'

/**
 * 饼图
 */
export default class Pie extends Base {
  /**
   * 单独导出时调用的初始化方法
   * @param {*} el 选择器或者 DOM 对象
   * @param {*} data 数据源
   * @param {*} options 可选项
   */
  static init (el, data, options) {
    return init(Pie, el, data, options)
  }

  /**
   * 将用户配置转换为符合 ECharts API 格式的配置格式
   */
  transform () {
    const {
      // 数据
      data = [],
      // 标题
      title = '饼图',
      // 是否环形图
      ring = false,
      // 属性字典
      keyMap = {
        textKey: 'key',
        dataKey: 'value'
      }
    } = this.settings

    if (data.length === 0) {
      throw new Error('数据源为空！')
    }

    // 文本对应属性名，数据值对应的属性名
    const { textKey, dataKey } = keyMap
    checkKeyInModel(data[0], textKey, dataKey)

    const legendData = []
    let radius = ring ? ['50%', '70%'] : '60%'
    let center = title ? ['50%', '60%'] : ['50%', '50%']
    const series = [{
      radius: radius,
      center: center,
      type: TYPE,
      data: []
    }]

    // 填充数据
    for (let i = 0; i < data.length; i++) {
      const element = data[i]
      const { [dataKey]: value, [textKey]: name, ...other } = element
      const item = {
        value,
        name,
        ...other,
        _raw: element
      }
      series[0].data.push(item)
    }
    return { title, series, legendData }
  }

  /**
   * 绘制图表
   */
  apply () {
    let { title, series, legendData } = this.options

    // 注入配置到series
    let { insertSeries } = this.settings
    let _series = series
    if (insertSeries && insertSeries.length && series.length) {
      _series = this.injectDataIntoSeries(insertSeries, _series)
    }

    let opts = {
      title: {
        text: title,
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: legendData
      },
      series: _series
    }

    this.echart.setOption(opts, true)
    this.echart.clear()
    this.echart.setOption(opts, true)
  }
}
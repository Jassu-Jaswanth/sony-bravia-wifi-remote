const IRCC_CODES = {
  // Power
  PowerOff: 'AAAAAQAAAAEAAAAvAw==',
  
  // Input
  Input: 'AAAAAQAAAAEAAAAlAw==',
  Hdmi1: 'AAAAAgAAABoAAABaAw==',
  Hdmi2: 'AAAAAgAAABoAAABbAw==',
  Hdmi3: 'AAAAAgAAABoAAABcAw==',
  Hdmi4: 'AAAAAgAAABoAAABdAw==',
  
  // Numbers
  Num0: 'AAAAAQAAAAEAAAAJAw==',
  Num1: 'AAAAAQAAAAEAAAAAAw==',
  Num2: 'AAAAAQAAAAEAAAABAw==',
  Num3: 'AAAAAQAAAAEAAAACAw==',
  Num4: 'AAAAAQAAAAEAAAADAw==',
  Num5: 'AAAAAQAAAAEAAAAEAw==',
  Num6: 'AAAAAQAAAAEAAAAFAw==',
  Num7: 'AAAAAQAAAAEAAAAGAw==',
  Num8: 'AAAAAQAAAAEAAAAHAw==',
  Num9: 'AAAAAQAAAAEAAAAIAw==',
  DOT: 'AAAAAgAAAJcAAAAdAw==',
  
  // Navigation
  Up: 'AAAAAQAAAAEAAAB0Aw==',
  Down: 'AAAAAQAAAAEAAAB1Aw==',
  Left: 'AAAAAQAAAAEAAAA0Aw==',
  Right: 'AAAAAQAAAAEAAAAzAw==',
  Confirm: 'AAAAAQAAAAEAAABlAw==',
  Return: 'AAAAAgAAAJcAAAAjAw==',
  Exit: 'AAAAAQAAAAEAAABjAw==',
  
  // Color buttons
  Red: 'AAAAAgAAAJcAAAAlAw==',
  Green: 'AAAAAgAAAJcAAAAmAw==',
  Yellow: 'AAAAAgAAAJcAAAAnAw==',
  Blue: 'AAAAAgAAAJcAAAAkAw==',
  
  // Volume
  VolumeUp: 'AAAAAQAAAAEAAAASAw==',
  VolumeDown: 'AAAAAQAAAAEAAAATAw==',
  Mute: 'AAAAAQAAAAEAAAAUAw==',
  
  // Channel
  ChannelUp: 'AAAAAQAAAAEAAAAQAw==',
  ChannelDown: 'AAAAAQAAAAEAAAARAw==',
  
  // Media Control
  Play: 'AAAAAgAAAJcAAAAaAw==',
  Pause: 'AAAAAgAAAJcAAAAZAw==',
  Stop: 'AAAAAgAAAJcAAAAYAw==',
  Rewind: 'AAAAAgAAAJcAAAAbAw==',
  Forward: 'AAAAAgAAAJcAAAAcAw==',
  Prev: 'AAAAAgAAAJcAAAA8Aw==',
  Next: 'AAAAAgAAAJcAAAA9Aw==',
  Rec: 'AAAAAgAAAJcAAAAgAw==',
  
  // TV Functions
  Home: 'AAAAAQAAAAEAAABgAw==',
  Guide: 'AAAAAgAAAKQAAABbAw==',
  EPG: 'AAAAAgAAAKQAAABbAw==',
  Favorites: 'AAAAAgAAAHcAAAB2Aw==',
  Display: 'AAAAAQAAAAEAAAA6Aw==',
  Options: 'AAAAAgAAAJcAAAA2Aw==',
  Settings: 'AAAAAgAAAJcAAAA2Aw==',
  ActionMenu: 'AAAAAgAAAMQAAABLAw==',
  
  // Apps
  Netflix: 'AAAAAgAAABoAAAB8Aw==',
  YouTube: 'AAAAAgAAAMQAAABHAw==',
  
  // Audio
  Audio: 'AAAAAQAAAAEAAAAXAw==',
  SubTitle: 'AAAAAgAAAJcAAAAoAw==',
  
  // Picture
  PictureMode: 'AAAAAQAAAAEAAABkAw==',
  Wide: 'AAAAAgAAAKQAAAA9Aw==',
  
  // Misc
  Help: 'AAAAAgAAAMQAAABNAw==',
  Sleep: 'AAAAAQAAAAEAAAAvAw==',
  SleepTimer: 'AAAAAQAAAAEAAAA2Aw==',
  Jump: 'AAAAAQAAAAEAAAA7Aw==',
  PicOff: 'AAAAAQAAAAEAAAA+Aw==',
  TvPause: 'AAAAAgAAAJcAAAA2Aw==',
  OneTouchView: 'AAAAAgAAABoAAABlAw==',
  OneTouchTimeRec: 'AAAAAgAAABoAAABkAw==',
  OneTouchRec: 'AAAAAgAAABoAAABiAw==',
  OneTouchRecStop: 'AAAAAgAAABoAAABjAw==',
  GooglePlay: 'AAAAAgAAAMQAAABGAw==',
  
  // Text Input
  Teletext: 'AAAAAQAAAAEAAAA/Aw==',
  
  // 3D
  Mode3D: 'AAAAAgAAAHcAAABNAw==',
  
  // Digital
  Digital: 'AAAAAgAAAJcAAAAyAw==',
  Analog: 'AAAAAgAAAHcAAAANAw==',
  BS: 'AAAAAgAAAJcAAAAsAw==',
  CS: 'AAAAAgAAAJcAAAArAw==',
  BSCS: 'AAAAAgAAAJcAAAAQAw==',
  
  // Sync
  SyncMenu: 'AAAAAgAAABoAAABYAw==',
}

class SonyBraviaAPI {
  constructor() {
    this.baseUrl = ''
    this.psk = ''
  }

  configure(ip, psk) {
    this.baseUrl = `http://${ip}`
    this.psk = psk
  }

  async request(service, method, params = [], version = '1.0') {
    const url = `${this.baseUrl}/sony/${service}`
    const body = {
      method,
      params,
      id: Math.floor(Math.random() * 100000),
      version
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-PSK': this.psk
        },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error[1] || 'API Error')
      }
      return data.result
    } catch (error) {
      console.error(`API Error [${service}/${method}]:`, error)
      throw error
    }
  }

  async sendIRCC(code) {
    const irccCode = IRCC_CODES[code] || code
    const soapBody = `<?xml version="1.0"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
  <s:Body>
    <u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1">
      <IRCCCode>${irccCode}</IRCCCode>
    </u:X_SendIRCC>
  </s:Body>
</s:Envelope>`

    try {
      const response = await fetch(`${this.baseUrl}/sony/IRCC`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml; charset=UTF-8',
          'X-Auth-PSK': this.psk,
          'SOAPACTION': '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"'
        },
        body: soapBody
      })
      return response.ok
    } catch (error) {
      console.error('IRCC Error:', error)
      return false
    }
  }

  async getPowerStatus() {
    try {
      const result = await this.request('system', 'getPowerStatus')
      return result[0]?.status || 'unknown'
    } catch {
      return 'unknown'
    }
  }

  async getSystemInfo() {
    try {
      const result = await this.request('system', 'getSystemInformation')
      return result[0]
    } catch {
      return null
    }
  }

  async getVolumeInfo() {
    try {
      const result = await this.request('audio', 'getVolumeInformation')
      const speaker = result[0]?.find(v => v.target === 'speaker')
      return speaker || { volume: 0, mute: false }
    } catch {
      return { volume: 0, mute: false }
    }
  }

  async setVolume(volume, target = 'speaker') {
    return this.request('audio', 'setAudioVolume', [{
      volume: String(volume),
      ui: 'on',
      target
    }])
  }

  async adjustVolume(direction) {
    const vol = direction > 0 ? '+1' : '-1'
    return this.request('audio', 'setAudioVolume', [{
      volume: vol,
      ui: 'on',
      target: 'speaker'
    }])
  }

  async setMute(mute) {
    return this.request('audio', 'setAudioMute', [{
      status: mute
    }])
  }

  async getInputs() {
    try {
      const result = await this.request('avContent', 'getCurrentExternalInputsStatus')
      return result[0] || []
    } catch {
      return []
    }
  }

  async setInput(uri) {
    return this.request('avContent', 'setPlayContent', [{
      uri
    }])
  }

  async getApps() {
    try {
      const result = await this.request('appControl', 'getApplicationList')
      return result[0] || []
    } catch {
      return []
    }
  }

  async launchApp(uri) {
    return this.request('appControl', 'setActiveApp', [{
      uri
    }])
  }

  async sendText(text) {
    return this.request('appControl', 'setTextForm', [text])
  }

  async powerOn() {
    return this.request('system', 'setPowerStatus', [{
      status: true
    }])
  }

  async powerOff() {
    return this.sendIRCC('PowerOff')
  }

  async testConnection() {
    try {
      const info = await this.getSystemInfo()
      return info !== null
    } catch {
      return false
    }
  }
}

export const sonyApi = new SonyBraviaAPI()
export { IRCC_CODES }

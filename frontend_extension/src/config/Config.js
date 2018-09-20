import React from "react";
import { observer, inject } from "mobx-react";
import Lottie from "../components/Lottie";
import styled, { ThemeProvider } from "styled-components";
// import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import images from "../images";
import Text from "../components/Text";
import BubbleType from "../components/BubbleType";
import AnimType from "../components/AnimType";
import SKUType from "../components/SKUType";
import {
  Button,
  TextInput,
  FlexRow,
  SectionHeader,
  InputText
} from "../styles";
import * as loaderRingAnimation from "../animations/snap_loader_white.json";
// import {
//   faCopy,
//   faExclamationCircle
// } from "@fortawesome/fontawesome-free-solid";

// Consts
import EXT_CONFIG from "../constants/EXT_CONFIG";
import BUBBLE_TYPES from "../constants/BUBBLE_TYPES";
import ANIM_TYPES from "../constants/ANIM_TYPES";
import SKU_TYPES from "../constants/SKU_TYPES";
import NOTIFICATION_TYPES from "../constants/NOTIFICATION_TYPES";
import RESPONSE_STATES from "../constants/RESPONSE_STATES";

@inject("configStore")
@observer
class Config extends React.Component {
  constructor(props) {
    super(props);

    this.onChangeAddTextInput = this.onChangeAddTextInput.bind(this);
    this.onClickAddText = this.onClickAddText.bind(this);
    this.onClickBubbleType = this.onClickBubbleType.bind(this);
    this.onClickAnimType = this.onClickAnimType.bind(this);
    this.onClickSKU = this.onClickSKU.bind(this);
    this.onClickRemoveText = this.onClickRemoveText.bind(this);
    this.onClickWidgetLink = this.onClickWidgetLink.bind(this);
    this.onSaveConfigClick = this.onSaveConfigClick.bind(this);

    // Get config callbacks
    this.onErrorGetConfig = this.onErrorGetConfig.bind(this);
    this.onSuccessGetConfig = this.onSuccessGetConfig.bind(this);
    // Save config callbacks
    this.onErrorSaveConfig = this.onErrorSaveConfig.bind(this);
    this.onSuccessSaveConfig = this.onSuccessSaveConfig.bind(this);
    this.onClickTestPurchase = this.onClickTestPurchase.bind(this);

    this.renderWidgetLink = this.renderWidgetLink.bind(this);
  }

  componentDidMount() {
    const { streamerConfigStore } = this.props.configStore;

    if (window.Twitch.ext) {
      window.Twitch.ext.onAuthorized(auth => {
        // console.log("auth", auth);
        // console.log("channel id: ", auth.channelId);

        streamerConfigStore.getConfig(
          auth,
          this.onErrorGetConfig,
          this.onSuccessGetConfig,
          this.onStreamerLive
        );
      });

      window.Twitch.ext.onContext((context, contextFields) => {
        // console.log("contextFields", contextFields);
      });

      window.Twitch.ext.onError(err => {
        // console.error("error", err);
      });
    }
  }

  onErrorGetConfig = value => {
    const { configStore } = this.props;

    configStore.showNotification(NOTIFICATION_TYPES.ERROR, value);
  };

  onSuccessGetConfig = value => {
    const { configStore } = this.props;

    // configStore.showNotification(NOTIFICATION_TYPES.INFO, value);
  };

  onStreamerLive = () => {
    const { configStore } = this.props;

    configStore.showNotification(
      NOTIFICATION_TYPES.ERROR,
      "You cant change config while you stream. If you stopped streaming but still see this message then, please, give Twitch up to 10 minutes to update your status."
    );
  };

  onErrorSaveConfig = value => {
    const { configStore } = this.props;

    configStore.showNotification(NOTIFICATION_TYPES.ERROR, value);
  };

  onSuccessSaveConfig = value => {
    const { configStore } = this.props;

    configStore.showNotification(NOTIFICATION_TYPES.INFO, value);
  };

  onChangeAddTextInput = event => {
    const { configStore } = this.props;

    configStore.updateAddTextInput(event.target.value);
  };

  onClickAddText = () => {
    const { configStore } = this.props;

    configStore.addText();
  };

  onClickBubbleType = id => {
    const { streamerConfigStore } = this.props.configStore;

    if (streamerConfigStore.bubbles.find(bubble => bubble.id == id))
      streamerConfigStore.removeBubble(id);
    else streamerConfigStore.addBubble(id);
  };

  onClickAnimType = id => {
    const { streamerConfigStore } = this.props.configStore;

    if (streamerConfigStore.animations.find(anim => anim.id == id))
      streamerConfigStore.removeAnim(id);
    else streamerConfigStore.addAnim(id);
  };

  onClickSKU = sku => {
    const { streamerConfigStore } = this.props.configStore;

    streamerConfigStore.setSKU(sku);
  };

  onClickRemoveText = id => {
    const { streamerConfigStore } = this.props.configStore;

    streamerConfigStore.removeText(id);
  };

  onClickWidgetLink = () => {
    const { configStore } = this.props;

    this.widgetLinkRef.select();
    document.execCommand("Copy");

    configStore.setCopiedToClippboard(true);
  };

  onSaveConfigClick = () => {
    const { configStore } = this.props;
    const { streamerConfigStore } = configStore;
    const { live } = streamerConfigStore;

    if (live) {
      configStore.showNotification(
        NOTIFICATION_TYPES.ERROR,
        "You cant change config while you stream. If you stopped streaming but still see this message then, please, give Twitch up to 10 minutes to update your status."
      );
    } else {
      streamerConfigStore.saveConfig(
        this.onErrorSaveConfig,
        this.onSuccessSaveConfig
      );
    }
  };

  onClickTestPurchase = () => {
    const { configStore } = this.props;
    const { streamerConfigStore } = configStore;

    configStore.purchaseTextFree();
  };

  renderWidgetLink() {
    const { streamerConfigStore, copiedToClipboard } = this.props.configStore;
    const { registered } = streamerConfigStore;

    if (streamerConfigStore.registered)
      return (
        <WidgetLinkContainer>
          <WidgetLinkHeader readOnly value={"WIDGET LINK:"} />
          <WidgetLink
            readOnly
            value={EXT_CONFIG.BUBBLE_TEXT_ENDPOINT + streamerConfigStore.link}
            onClick={this.onClickWidgetLink}
            innerRef={x => {
              this.widgetLinkRef = x;
            }}
          />

          <CopyToClipboardWidgetLinkButton onClick={this.onClickWidgetLink}>
            <CopyIcon className={"fas fa-copy"} />
            {copiedToClipboard ? "Copied" : "Copy"}
          </CopyToClipboardWidgetLinkButton>
        </WidgetLinkContainer>
      );

    return (
      <WidgetLinkContainer>
        <WidgetLinkHeader readOnly value={"WIDGET LINK:"} />
        <WidgetLink readOnly value={"Save config to get widget link"} />

        <CopyToClipboardWidgetLinkButton>
          <CopyIcon className={"fas fa-copy"} />Copy
        </CopyToClipboardWidgetLinkButton>
        {/* <a href={"http://bubbletext.io/tutorial"} target={"_blank"}>
          <WidgetGuide>Tutorial</WidgetGuide>
        </a> */}
      </WidgetLinkContainer>
    );
  }

  renderNotification() {
    const {
      isNotificationShows,
      notificationText,
      notificationType
    } = this.props.configStore;

    let notificationColor;
    switch (notificationType) {
      case NOTIFICATION_TYPES.INFO:
        notificationColor = EXT_CONFIG.SELECTED_COLOR;
        break;
      case NOTIFICATION_TYPES.ERROR:
        notificationColor = EXT_CONFIG.MAIN_COLOR;
        break;
      case NOTIFICATION_TYPES.WARNING:
        notificationColor = "yellow";
        break;
      default:
        break;
    }

    if (isNotificationShows)
      return (
        <ActionNotification color={notificationColor}>
          <NotificationIcon
            className={"fas fa-exclamation-circle"}
            // icon={faExclamationCircle}
            color={notificationColor}
          />
          {notificationText}
        </ActionNotification>
      );

    return null;
  }

  renderSaveButton(live) {
    if (live) {
      return (
        <LiveButton onClick={this.onSaveConfigClick}>Save config</LiveButton>
      );
    }

    return (
      <SaveConfigButton onClick={this.onSaveConfigClick}>
        Save config
      </SaveConfigButton>
    );
  }

  renderTestButton(registered) {
    if (registered) {
      return <Button onClick={this.onClickTestPurchase}>Test</Button>;
    }

    return null;
  }

  render() {
    const { streamerConfigStore, addTextInput } = this.props.configStore;
    const {
      animations,
      isConfigFetched,
      theme,
      priceSKU,
      live,
      registered
    } = streamerConfigStore;

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: loaderRingAnimation,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };
    // console.log("isConfigFetched: " + isConfigFetched);

    if (isConfigFetched == RESPONSE_STATES.DONE) {
      return (
        <ThemeProvider theme={theme}>
          <Container>
            <LogoImage src={images.logo} />

            <SectionHeader>
              Add your texts ({streamerConfigStore.texts.length}/{
                EXT_CONFIG.MAX_TEXTS_COUNT
              })
            </SectionHeader>

            <FlexRow>
              <TextInput
                type={"text"}
                value={addTextInput}
                max={40}
                maxLength={40}
                onChange={this.onChangeAddTextInput}
                placeholder={"New text..."}
              />
              <Button onClick={this.onClickAddText}>Add text</Button>
            </FlexRow>

            <FlexRow>
              {streamerConfigStore.texts.slice().map(text => {
                return (
                  <Text
                    key={text.id}
                    scale={1.2}
                    id={text.id}
                    value={text.text}
                    selected={false}
                    removable={true}
                    onClick={this.onClickText}
                    onClickRemoveButton={this.onClickRemoveText}
                  />
                );
              })}
            </FlexRow>

            <SectionHeader>
              Choose your bubbles ({streamerConfigStore.bubbles.length}/
              {EXT_CONFIG.MAX_BUBBLES_COUNT})
            </SectionHeader>
            <FlexRow>
              {BUBBLE_TYPES.map(bubble => {
                const selected = streamerConfigStore.bubbles.find(
                  bub => bub.id == bubble.id
                );

                return (
                  <BubbleType
                    key={bubble.id}
                    id={bubble.id}
                    scale={0.6}
                    selected={selected}
                    onClickBubbleType={this.onClickBubbleType}
                  />
                );
              })}
            </FlexRow>

            <SectionHeader>
              Choose your animations ({streamerConfigStore.animations.length}/{
                EXT_CONFIG.MAX_ANIMATIONS_COUNT
              })
            </SectionHeader>
            <FlexRow>
              {ANIM_TYPES.map(anim => {
                const selected = streamerConfigStore.animations.find(
                  animat => animat.id == anim.id
                );

                return (
                  <AnimType
                    key={anim.id}
                    id={anim.id}
                    scale={0.6}
                    selected={selected}
                    onClickAnimType={this.onClickAnimType}
                  />
                );
              })}
            </FlexRow>

            <SectionHeader>Choose boost amount</SectionHeader>
            <FlexRow>
              {Object.values(SKU_TYPES).map(sku => {
                const selected = sku == priceSKU;

                let cost;
                switch (sku) {
                  case SKU_TYPES.price_sku_free:
                    cost = "free";
                    break;
                  case SKU_TYPES.price_sku_1:
                    cost = "1";
                    break;
                  case SKU_TYPES.price_sku_50:
                    cost = "50";
                    break;
                  case SKU_TYPES.price_sku_100:
                    cost = "100";
                    break;

                  default:
                    break;
                }

                return (
                  <SKUType
                    key={sku}
                    sku={sku}
                    cost={cost}
                    scale={0.6}
                    selected={selected}
                    onClick={this.onClickSKU}
                  />
                );
              })}
            </FlexRow>
            <WidgetRow>
              {this.renderWidgetLink()}
              <a href={"http://bubbletext.io/tutorial"} target={"_blank"}>
                <WidgetGuide>Widget Tutorial</WidgetGuide>
              </a>
            </WidgetRow>
            <WidgetRow>
              {this.renderSaveButton(live)}
              {this.renderTestButton(registered)}
            </WidgetRow>

            {this.renderNotification()}
          </Container>
        </ThemeProvider>
      );
    }

    return (
      <ThemeProvider theme={theme}>
        <Lottie options={defaultOptions} height={100} width={100} />
      </ThemeProvider>
    );
  }
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 14px 40px;
  background-color: ${EXT_CONFIG.THEME ? `#201c2b` : `white`};
`;

export const LogoImage = styled.img`
  width: 219px;
  height: 60px;
`;

export const WidgetLinkContainer = styled.div`
  height: 56px;
  line-height: 58px;
  color: black;
  font-size: 20px;
  font-weight: bold;
  margin-top: -1px;
  flex: 1;
  display: flex;
  flex-direction: row;
`;

export const WidgetLinkHeader = styled(InputText)`
  background-color: ${EXT_CONFIG.SELECTED_COLOR};
  display: inline-block;
  border-radius: 10px 0 0px 10px;
  text-align: center;
  border: 2px solid ${EXT_CONFIG.ADDITIONAL_COLOR};
  max-width: 110px;
  flex: 1;
`;

export const WidgetLink = styled(InputText)`
  background-color: white;
  display: inline-block;
  text-transform: lowercase;
  ${"" /* border-radius: 0 10px 10px 0; */}
  border: 2px solid ${EXT_CONFIG.ADDITIONAL_COLOR};
  border-left: 0px;
  border-right: 0px;
  flex: 5;
`;

export const CopyToClipboardWidgetLinkButton = styled(Button)`
  background-color: ${EXT_CONFIG.MAIN_COLOR};
  height: 60px;
  display: inline-block;
  border-radius: 0 10px 10px 0;
  ${"" /* border-radius: 0; */}
  border: 2px solid ${EXT_CONFIG.ADDITIONAL_COLOR};
  border-left: 0px;
  ${"" /* border-right: 0px; */} flex: 1;
  margin-left: 0;
  ${"" /* margin-right: 0; */};
`;

export const WidgetGuide = styled(Button)`
  background-color: ${EXT_CONFIG.MAIN_COLOR};
  height: 60px;
  display: inline-block;
  border-radius: 10px;
  border: 2px solid ${EXT_CONFIG.ADDITIONAL_COLOR};
  flex: 1;
  margin-left: 0;
`;

export const CopyIcon = styled.i`
  display: inline-block;
  margin-right: 10px;
`;

export const NotificationIcon = styled.i`
  display: inline-block;
  margin-right: 6px;
  color: ${props => props.color};
`;

export const ActionNotification = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  right: 50px;
  top: 10px;
  width: 300px;
  ${"" /* height: 80px; */} border-radius: 10px;
  border: 2px solid ${props => props.color};
  padding: 20px;
  font-size: 24px;
  z-index: 9999;
  ${"" /* &:hover {
    background-color: ${EXT_CONFIG.ADDITIONAL_COLOR};
  } */};
`;

export const SaveConfigButton = styled(Button)`
  margin: 0;
  max-width: 400px;
  flex: 4;
  ${"" /* background: grey; */};
`;

export const LiveButton = styled(SaveConfigButton)`
  background: grey;
`;

export const WidgetRow = styled(FlexRow)`
  margin-top: 6px;
`;

export default Config;

﻿import SendClockReactSvgUrl from "PUBLIC_DIR/images/send.clock.react.svg?url";
import PencilOutlineReactSvgUrl from "PUBLIC_DIR/images/pencil.outline.react.svg?url";
import DefaultUserAvatarMax from "PUBLIC_DIR/images/default_user_photo_size_200-200.png";
import React, { useState, useEffect } from "react";
import { ReactSVG } from "react-svg";
import { useTranslation } from "react-i18next";
import { inject, observer } from "mobx-react";

import Avatar from "@docspace/components/avatar";
import Text from "@docspace/components/text";
import Link from "@docspace/components/link";
import ComboBox from "@docspace/components/combobox";
import IconButton from "@docspace/components/icon-button";
import { isMobileOnly } from "react-device-detect";
import toastr from "@docspace/components/toast/toastr";

import { getUserRole, convertLanguage } from "@docspace/common/utils";

import { Trans } from "react-i18next";
//import TimezoneCombo from "./timezoneCombo";

import {
  AvatarEditorDialog,
  ChangeEmailDialog,
  ChangePasswordDialog,
  ChangeNameDialog,
} from "SRC_DIR/components/dialogs";

import { StyledWrapper, StyledInfo, StyledLabel } from "./styled-main-profile";
import { HelpButton, Tooltip } from "@docspace/components";
import withCultureNames from "@docspace/common/hoc/withCultureNames";
import { isSmallTablet } from "@docspace/components/utils/device";

const MainProfile = (props) => {
  const { t } = useTranslation(["Profile", "Common"]);

  const {
    theme,
    profile,
    culture,
    helpLink,
    cultureNames,
    setIsLoading,
    changeEmailVisible,
    setChangeEmailVisible,
    changePasswordVisible,
    setChangePasswordVisible,
    changeNameVisible,
    setChangeNameVisible,
    changeAvatarVisible,
    setChangeAvatarVisible,
    withActivationBar,
    sendActivationLink,
    currentColorScheme,
    updateProfileCulture,
    documentationEmail,
  } = props;

  const [horizontalOrientation, setHorizontalOrientation] = useState(false);

  useEffect(() => {
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const checkWidth = () => {
    if (!isMobileOnly) return;

    if (!isSmallTablet()) {
      setHorizontalOrientation(true);
    } else {
      setHorizontalOrientation(false);
    }
  };

  const role = getUserRole(profile);

  const sendActivationLinkAction = () => {
    sendActivationLink && sendActivationLink(t);
  };

  const userAvatar = profile.hasAvatar
    ? profile.avatarMax
    : DefaultUserAvatarMax;

  const tooltipLanguage = (
    <Text fontSize="13px">
      <Trans t={t} i18nKey="NotFoundLanguage" ns="Common">
        "In case you cannot find your language in the list of the available
        ones, feel free to write to us at
        <Link
          href={`mailto:${documentationEmail}`}
          isHovered={true}
          color={theme.profileInfo.tooltipLinkColor}
        >
          {{ supportEmail: documentationEmail }}
        </Link>
        to take part in the translation and get up to 1 year free of charge."
      </Trans>{" "}
      <Link
        color={theme.profileInfo.tooltipLinkColor}
        isHovered={true}
        href={`${helpLink}/guides/become-translator.aspx`}
        target="_blank"
      >
        {t("Common:LearnMore")}
      </Link>
    </Text>
  );

  const isMobileHorizontalOrientation = isMobileOnly && horizontalOrientation;

  const { cultureName, currentCulture } = profile;
  const language = convertLanguage(cultureName || currentCulture || culture);

  const selectedLanguage = cultureNames.find((item) => item.key === language) ||
    cultureNames.find((item) => item.key === culture) || {
      key: language,
      label: "",
    };

  const onLanguageSelect = (language) => {
    if (profile.cultureName === language.key) return;

    setIsLoading(true);
    updateProfileCulture(profile.id, language.key)
      .then(() => setIsLoading(false))
      .then(() => location.reload())
      .catch((error) => {
        toastr.error(error && error.message ? error.message : error);
        setIsLoading(false);
      });
  };

  return (
    <StyledWrapper>
      <Avatar
        className={"avatar"}
        size="max"
        role={role}
        source={userAvatar}
        userName={profile.displayName}
        editing={true}
        editAction={() => setChangeAvatarVisible(true)}
      />
      <StyledInfo
        withActivationBar={withActivationBar}
        currentColorScheme={currentColorScheme}
      >
        <div className="rows-container">
          <div className="profile-block">
            <StyledLabel as="div">{t("Common:Name")}</StyledLabel>

            <StyledLabel as="div" marginTopProp="16px">
              {t("Common:Email")}
            </StyledLabel>

            <StyledLabel
              as="div"
              marginTopProp={withActivationBar ? "34px" : "16px"}
            >
              {t("Common:Password")}
            </StyledLabel>

            <StyledLabel
              as="div"
              className="profile-language"
              marginTopProp="15px"
            >
              {t("Common:Language")}
              <HelpButton
                size={12}
                offsetRight={0}
                place="right"
                tooltipContent={tooltipLanguage}
              />
            </StyledLabel>
          </div>

          <div className="profile-block">
            <div className="profile-block-field">
              <Text fontWeight={600} truncate>
                {profile.displayName}
              </Text>
              <IconButton
                className="edit-button"
                iconName={PencilOutlineReactSvgUrl}
                size="12"
                onClick={() => setChangeNameVisible(true)}
              />
            </div>
            <div className="email-container">
              <div className="email-edit-container">
                <Text
                  data-for="emailTooltip"
                  data-tip={t("EmailNotVerified")}
                  as="div"
                  className="email-text-container"
                  fontWeight={600}
                >
                  {profile.email}
                </Text>
                {withActivationBar && (
                  <Tooltip
                    id="emailTooltip"
                    getContent={(dataTip) => (
                      <Text fontSize="12px">{dataTip}</Text>
                    )}
                    effect="float"
                    place="bottom"
                  />
                )}
                <IconButton
                  className="edit-button email-edit-button"
                  iconName={PencilOutlineReactSvgUrl}
                  size="12"
                  onClick={() => setChangeEmailVisible(true)}
                />
              </div>
              {withActivationBar && (
                <div
                  className="send-again-container"
                  onClick={sendActivationLinkAction}
                >
                  <ReactSVG
                    className="send-again-icon"
                    src={SendClockReactSvgUrl}
                  />
                  <Text className="send-again-text" fontWeight={600} noSelect>
                    {t("SendAgain")}
                  </Text>
                </div>
              )}
            </div>
            <div className="profile-block-field profile-block-password">
              <Text fontWeight={600}>********</Text>
              <IconButton
                className="edit-button"
                iconName={PencilOutlineReactSvgUrl}
                size="12"
                onClick={() => setChangePasswordVisible(true)}
              />
            </div>
            <div className="language-combo-box-wrapper">
              <ComboBox
                className="language-combo-box"
                directionY={isMobileHorizontalOrientation ? "bottom" : "both"}
                options={cultureNames}
                selectedOption={selectedLanguage}
                onSelect={onLanguageSelect}
                isDisabled={false}
                scaled={isMobileOnly}
                scaledOptions={false}
                size="content"
                showDisabledItems={true}
                dropDownMaxHeight={364}
                manualWidth="250px"
                isDefaultMode={
                  isMobileHorizontalOrientation
                    ? isMobileHorizontalOrientation
                    : !isMobileOnly
                }
                withBlur={isMobileHorizontalOrientation ? false : isMobileOnly}
                fillIcon={false}
                modernView={!isMobileOnly}
              />
            </div>
          </div>
        </div>
        <div className="mobile-profile-block">
          <div className="mobile-profile-row">
            <div className="mobile-profile-field">
              <Text className="mobile-profile-label" as="div">
                {t("Common:Name")}
              </Text>
              <Text
                className="mobile-profile-label-field"
                fontWeight={600}
                truncate
              >
                {profile.displayName}
              </Text>
            </div>
            <IconButton
              className="edit-button"
              iconName={PencilOutlineReactSvgUrl}
              size="12"
              onClick={() => setChangeNameVisible(true)}
            />
          </div>
          <div className="mobile-profile-row">
            <div className="mobile-profile-field">
              <Text className="mobile-profile-label" as="div">
                {t("Common:Email")}
              </Text>
              <div className="email-container">
                <div className="email-edit-container">
                  <Text
                    data-for="emailTooltip"
                    data-tip={t("EmailNotVerified")}
                    as="div"
                    className="email-text-container"
                    fontWeight={600}
                  >
                    {profile.email}
                  </Text>
                </div>
                {withActivationBar && (
                  <Tooltip
                    id="emailTooltip"
                    getContent={(dataTip) => (
                      <Text fontSize="12px">{dataTip}</Text>
                    )}
                    effect="float"
                    place="bottom"
                  />
                )}
              </div>
              {withActivationBar && (
                <div
                  className="send-again-container"
                  onClick={sendActivationLinkAction}
                >
                  <ReactSVG
                    className="send-again-icon"
                    src={SendClockReactSvgUrl}
                  />
                  <Text className="send-again-text" fontWeight={600} noSelect>
                    {t("SendAgain")}
                  </Text>
                </div>
              )}
            </div>
            <IconButton
              className="edit-button"
              iconName={PencilOutlineReactSvgUrl}
              size="12"
              onClick={() => setChangeEmailVisible(true)}
            />
          </div>
          <div className="mobile-profile-row">
            <div className="mobile-profile-field">
              <Text as="div" className="mobile-profile-label">
                {t("Common:Password")}
              </Text>
              <Text className="mobile-profile-password" fontWeight={600}>
                ********
              </Text>
            </div>
            <IconButton
              className="edit-button"
              iconName={PencilOutlineReactSvgUrl}
              size="12"
              onClick={() => setChangePasswordVisible(true)}
            />
          </div>

          <div className="mobile-language">
            <Text as="div" fontWeight={600} className="mobile-profile-label">
              {t("Common:Language")}
              <HelpButton
                size={12}
                offsetRight={0}
                place="right"
                tooltipContent={tooltipLanguage}
              />
            </Text>
            <ComboBox
              className="language-combo-box"
              directionY={isMobileHorizontalOrientation ? "bottom" : "both"}
              options={cultureNames}
              selectedOption={selectedLanguage}
              onSelect={onLanguageSelect}
              isDisabled={false}
              scaled={isMobileOnly}
              scaledOptions={false}
              size="content"
              showDisabledItems={true}
              dropDownMaxHeight={364}
              manualWidth="250px"
              isDefaultMode={
                isMobileHorizontalOrientation
                  ? isMobileHorizontalOrientation
                  : !isMobileOnly
              }
              withBlur={isMobileHorizontalOrientation ? false : isMobileOnly}
              fillIcon={false}
              modernView={!isMobileOnly}
            />
          </div>
        </div>
        {/* <TimezoneCombo title={t("Common:ComingSoon")} /> */}
      </StyledInfo>

      {changeEmailVisible && (
        <ChangeEmailDialog
          visible={changeEmailVisible}
          onClose={() => setChangeEmailVisible(false)}
          user={profile}
        />
      )}

      {changePasswordVisible && (
        <ChangePasswordDialog
          visible={changePasswordVisible}
          onClose={() => setChangePasswordVisible(false)}
          email={profile.email}
        />
      )}

      {changeNameVisible && (
        <ChangeNameDialog
          visible={changeNameVisible}
          onClose={() => setChangeNameVisible(false)}
          profile={profile}
        />
      )}

      {changeAvatarVisible && (
        <AvatarEditorDialog
          t={t}
          visible={changeAvatarVisible}
          onClose={() => setChangeAvatarVisible(false)}
        />
      )}
    </StyledWrapper>
  );
};

export default inject(({ auth, peopleStore }) => {
  const { withActivationBar, sendActivationLink } = auth.userStore;
  const {
    theme,
    helpLink,
    culture,
    currentColorScheme,
    documentationEmail,
  } = auth.settingsStore;
  const { setIsLoading } = peopleStore.loadingStore;

  const {
    targetUser: profile,
    changeEmailVisible,
    setChangeEmailVisible,
    changePasswordVisible,
    setChangePasswordVisible,
    changeNameVisible,
    setChangeNameVisible,
    changeAvatarVisible,
    setChangeAvatarVisible,
    updateProfileCulture,
  } = peopleStore.targetUserStore;

  return {
    theme,
    profile,
    culture,
    helpLink,
    setIsLoading,
    changeEmailVisible,
    setChangeEmailVisible,
    changePasswordVisible,
    setChangePasswordVisible,
    changeNameVisible,
    setChangeNameVisible,
    changeAvatarVisible,
    setChangeAvatarVisible,
    withActivationBar,
    sendActivationLink,
    currentColorScheme,
    updateProfileCulture,
    documentationEmail,
  };
})(withCultureNames(observer(MainProfile)));

import React from "react";

import { Container, List, Divider, Image } from "semantic-ui-react";
import "./Footer.css";
function Footer() {
  return (
    <div className="footer">
      <Container textAlign="center" className="footer__container">
        <Divider inverted section />
        <Image
          centered
          size="small"
          src="https://ressources.maformation.fr/mfx/img/centres/09212021_1730231340446065.png"
          alt="userPic"
        />
        <List horizontal inverted divided link size="small">
          <List.Item as="a" href="https://github.com/AdieuBerthe/NftDapps">
            Source Code
          </List.Item>
          <List.Item
            as="a"
            href="https://github.com/AdieuBerthe/NftDapps/blob/master/LICENSE"
          >
            MIT License
          </List.Item>
        </List>
      </Container>
    </div>
  );
}

export default Footer;

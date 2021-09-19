---
sidemenu: false
---
# 胖友圈——用来吐槽和碎碎念 （未开放）

```jsx
/**
 * inline: true
 * compact: true
 */
import React from "react";
import {Auth} from "../../components/Auth";

// export default () => <Auth></Auth>
```

```jsx
/**
 * inline: true
 * compact: true
 */
import React from "react";
import {FriendsCard} from "../../components/FriendsCard";

export default () => <FriendsCard 
                        title="不知道说啥子"
                        time={Date.now()}
                        body="content body"
                        imgUrls={["https://cdn.jsdelivr.net/gh/kilicmu/markdown-images@master//image/—Pngtree—small animal rabbit head_5421523.png","https://cdn.jsdelivr.net/gh/kilicmu/markdown-images@master//image/—Pngtree—small animal rabbit head_5421523.png",
                        "https://cdn.jsdelivr.net/gh/kilicmu/markdown-images@master//image/—Pngtree—small animal rabbit head_5421523.png",
                        "https://cdn.jsdelivr.net/gh/kilicmu/markdown-images@master//image/—Pngtree—small animal rabbit head_5421523.png",
                        "https://cdn.jsdelivr.net/gh/kilicmu/markdown-images@master//image/—Pngtree—small animal rabbit head_5421523.png"


]}
                    />
```
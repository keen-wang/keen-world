interface ZegoPitch {
  begin_time: number;
  duration: number;
  pitch_value: number;
}

interface ZegoPitchConfig {
  /**五线谱横线颜色 */
  staffColor: string;
  /**竖线颜色 */
  verticalLineColor: string;
  /**默认音高线颜色 */
  standardPitchColor: string;
  /**击中音高线颜色 */
  hitPitchColor: string;
  /**音调指示器颜色 */
  pitchIndicatorColor: string;
  /**分数文本颜色 */
  scoreTextColor: string;
}

const SVG_URI = "http://www.w3.org/2000/svg";

export class ZegoPitchView {
  id: string;
  MAX_BACKGROUND_LINE_NUM = 5; // 最大背景线数量
  MUSIC_PITCH_NUM = 20; // 音阶数，可自行定义
  MUSIC_MAX_PITCH = 90; // 最大音高值,不可更改
  MUSIC_MIN_PITCH = 10; // 最小音高值，不可更改
  TIME_ELAPSED_ON_SCREEN = 1150; // 屏幕中已经唱过的时间（控件开始至竖线这一段表示的时间），可自行定义
  TIME_TO_PLAY_ON_SCREEN = 2750; // 屏幕中还未唱的时间（竖线至控件末尾这一段表示的时间），可自行定义
  /** 击中块时间间隔(调用 setCurrentSongProgress 方法的大致时间间隔) */
  ESTIMATED_CALL_INTERVAL = 60;
  /** 击中块时间间隔偏移 */
  ESTIMATED_CALL_INTERVAL_OFFSET = this.ESTIMATED_CALL_INTERVAL / 2;

  TRIANGLE_ANIM_TIME = this.ESTIMATED_CALL_INTERVAL; // 三角形动画的时间
  /**
   * 分数动画的几个时间段
   */
  ANIM_START_TIME = 200;
  ANIM_STARTING_TIME = 400;
  ANIM_RUNNING_TIME = 400;
  ANIM_END_TIME = 300;
  get ANIM_TOTAL_TIME(): number {
    return (
      this.ANIM_START_TIME +
      this.ANIM_STARTING_TIME +
      this.ANIM_RUNNING_TIME +
      this.ANIM_END_TIME
    );
  }

  /**
   * 三角形音调指示器的大小
   */
  TRIANGLE_WIDTH = 10;
  TRIANGLE_HEIGHT = 10;

  /**
   * 屏幕最左侧的时间点，即 （当前时间-TIME_ELAPSED_ON_SCREEN）
   */
  mStartTime = 0.5;

  mTimeLineWidth = 0.5;
  mBackgroundLineHeight = 0.5;

  // 界面图形相关参数
  mUnitWidth = 0; //单位毫秒时间长度
  mRectHeight = 0; //音高线的高度
  /**当前高音值三角形的x坐标 */
  mMidX = 0;
  /**当前高音值三角形的y坐标 */
  mMidY = 0;
  mMusicPitchList: ZegoPitch[] = []; //全部音高数据
  mHitRectList: ZegoPitch[] = []; //击中音高数据
  mCurrentMusicPitch = 0; //当前音高值，用于绘制三角指针的高度位置
  mCurrentSongTime = 0; //当前歌曲时间戳

  // pathInterpolator = new PathInterpolator(0.5, 0.5, 0.5, 0.5);
  mScoreOffsetY = 0;
  mScoreOffsetX = 0;
  mAnimHeight = 0;

  scoreList: {
    startTime: number;
    top: number;
    score: number;
  }[] = [];
  svg: SVGSVGElement;
  svgBg: SVGGElement;
  svgRect: SVGGElement;
  svgHitRect: SVGGElement;
  svgPoint: SVGGElement;
  container: HTMLElement | null = null;
  /**
   * UI config
   *
   */
  config = {
    staffColor: "#33FFFFFF", //五线谱横线颜色
    verticalLineColor: "#FFA87BF1", //竖线颜色
    standardPitchColor: "#FF5D3B94", //默认音高线颜色
    hitPitchColor: "#FF3751", // 击中音高线颜色
    pitchIndicatorColor: "#000", // 音调指示器颜色
    scoreTextColor: "#fff" //分数文本颜色
  };

  constructor() {
    const svg = (this.svg = document.createElementNS(SVG_URI, "svg"));
    this.id = `zg-pitch-view-${Date.now()}`;
    svg.setAttribute("id", this.id);
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");

    const bg = (this.svgBg = document.createElementNS(SVG_URI, "g"));
    svg.appendChild(bg);

    const svgRect = (this.svgRect = document.createElementNS(SVG_URI, "g"));
    svg.appendChild(svgRect);

    const svgHitRect = (this.svgHitRect = document.createElementNS(
      SVG_URI,
      "g"
    ));
    svg.appendChild(svgHitRect);

    const svgPoint = (this.svgPoint = document.createElementNS(SVG_URI, "g"));
    svg.appendChild(svgPoint);
  }

  mount(container: HTMLElement | string, config?: ZegoPitchConfig): void {
    if (typeof container === "string") {
      container = document.getElementById(container) as any;
    }
    if (container) {
      this.container = container as HTMLElement;
      this.container.append(this.svg);
    } else {
      throw "container not found";
    }
    config && this.setUIConfig(config);
    // 计算布局
    this.onLayout();
  }

  /**
   * 传入音高线数组
   */
  public setStandardPitch(pitchList: ZegoPitch[]): void {
    this.mMusicPitchList = [...pitchList].filter(item => item.pitch_value >= 0);
    // 过滤掉 pitch_value 为 -1 的行标记
  }

  /**
   * 设置当前播放时间和音阶，两个参数必须同时设置，保证数据同步性
   *
   * @param progress 当前播放时间
   * @param pitch 实时音高
   */
  public setCurrentSongProgress(progress: number, pitch: number): void {
    const {
      ESTIMATED_CALL_INTERVAL,
      ESTIMATED_CALL_INTERVAL_OFFSET,
      TIME_ELAPSED_ON_SCREEN
    } = this;
    this.mStartTime = progress - TIME_ELAPSED_ON_SCREEN;
    this.mCurrentSongTime = progress;
    this.mCurrentMusicPitch = pitch;
    // 根据当前时间找到对应的音高线数据
    const indexList = this.getCurrentMusicList(
      this.mMusicPitchList,
      this.mCurrentSongTime -
      this.ESTIMATED_CALL_INTERVAL -
      this.ESTIMATED_CALL_INTERVAL_OFFSET,
      this.ESTIMATED_CALL_INTERVAL + this.ESTIMATED_CALL_INTERVAL_OFFSET
    );
    let offsetPitch = -1;
    const currentMusicIndex = indexList.find(item => item >= 0);

    if (currentMusicIndex !== undefined && currentMusicIndex >= 0) {
      // 能够找到索引，有音高对应的情况
      offsetPitch = this.getOffsetPitch(pitch);
      if (offsetPitch === -1) {
        this.mCurrentMusicPitch = 0; // 无声情况
      } else {
        const musicPitch = this.mMusicPitchList[currentMusicIndex];
        // 根据偏差计算出实际音高值
        if (musicPitch !== undefined) {
          this.mCurrentMusicPitch = musicPitch.pitch_value + offsetPitch * 4;
          // 如果offsetPitch是0，那么当前的音高块是被击中了
          if (offsetPitch === 0) {
            // 击中块的开始时间不能提前当前musicPitch的开始时间，不能越界
            const hitStartTime = Math.max(
              musicPitch.begin_time,
              this.mCurrentSongTime -
              ESTIMATED_CALL_INTERVAL -
              ESTIMATED_CALL_INTERVAL_OFFSET
            );
            // 击中块的开始时间不能提前当前musicPitch的结束时间，不能越界
            const hitEndTime = Math.min(
              musicPitch.begin_time + musicPitch.duration,
              this.mCurrentSongTime
            );

            if (
              hitEndTime - hitStartTime !== 0 &&
              musicPitch.pitch_value !== -1
            ) {
              this.addHitRectList({
                duration: hitEndTime - hitStartTime,
                pitch_value: musicPitch.pitch_value,
                begin_time: Math.round(hitStartTime)
              });
            }
          }
        }
      }
    } else {
      // 找不到匹配的标准音高
      // 这种情况下，pitchOrPitchHit应该是实际音高值
      this.mCurrentMusicPitch = pitch;
    }

    // 当前高音值三角形的y坐标
    this.mMidY =
      this.getPitchTop(this.mCurrentMusicPitch) + this.mRectHeight / 2.0;

    // 触发绘制
    this.dispatchDraw();
  }

  /**
   * 设置高潮片段 当前播放时间和音阶，两个参数必须同时设置，保证数据同步性(仅用于高潮片段资源)
   *
   * @param progress 当前播放时间
   * @param pitch 实时音高
   * @param segmentBegin 高潮片段开始时间 （该字段在请求高潮片段资源时返回）
   * @param krcFormatOffset krc歌词对歌曲的偏移量 （该字段在krc歌词中返回）
   */
  public setAccompanimentClipCurrentSongProgress(
    progress: number,
    pitch: number,
    segmentBegin: number,
    krcFormatOffset: number
  ): void {
    this.setCurrentSongProgress(
      progress + segmentBegin - krcFormatOffset,
      pitch
    );
  }

  /**
   * 添加分数在当前时间点展示
   *
   * @param {number} score 分数
   */
  public addScore(score: number): void {
    const time = Date.now();
    this.scoreList.push({
      startTime: time,
      top: this.mMidY,
      score: score
    });
  }

  /**
   * 重置音高线数据
   */
  public reset(): void {
    this.mMusicPitchList = [];
    this.mHitRectList = [];
    this.mCurrentMusicPitch = 0;
    this.mStartTime = 0;
    this.mCurrentSongTime = 0;
    this.mMidY = this.getPitchTop(0);
  }

  /**
   *获取标准音高线开始的时间
   * @returns
   */
  public getPitchStartTime(): number {
    const { mMusicPitchList } = this;
    if (mMusicPitchList.length > 0) {
      return mMusicPitchList[0].begin_time;
    }

    return 0;
  }

  /**
   * 设置 ui
   * @param config
   */
  public setUIConfig(config: ZegoPitchConfig): void {
    this.config = {
      ...this.config,
      ...config
    };
  }

  private getOffsetPitch(pitch: number): number {
    let offsetScale = -1;
    switch (pitch) {
      case 1:
        offsetScale = -2;
        break;
      case 2:
      case 3:
      case 4:
        offsetScale = 0;
        break;
      case 5:
        offsetScale = 2;
        break;
      case 0:
      default:
        break;
    }
    return offsetScale;
  }
  private getPitchTop(pitch: number): number {
    const {
      MUSIC_MAX_PITCH,
      mRectHeight,
      MUSIC_MIN_PITCH,
      MUSIC_PITCH_NUM
    } = this;
    const paddingTop = this.getViewStyle("paddingTop") || 0;
    if (pitch > MUSIC_MAX_PITCH) {
      return this.getPitchTop(MUSIC_MAX_PITCH) - mRectHeight / 2;
    }

    if (pitch < MUSIC_MIN_PITCH) {
      return this.getPitchTop(MUSIC_MIN_PITCH) + mRectHeight / 2;
    }

    return (
      Math.floor(
        ((MUSIC_MAX_PITCH - pitch - 1) * MUSIC_PITCH_NUM) /
        (MUSIC_MAX_PITCH - MUSIC_MIN_PITCH)
      ) *
      mRectHeight +
      paddingTop
    );
  }
  private getViewStyle(
    key: string,
    type = "number"
  ): number | null | undefined {
    if (!this.svg) return null;
    const value = getComputedStyle(this.svg)[key as any];
    if (type === "number") return parseFloat(value);
  }
  /**
   * 计算布局
   * @returns
   */
  private onLayout(): // changed: boolean,
    // left: number,
    // top: number,
    // right: number,
    // bottom: number
    void {
    // super.onLayout(changed, left, top, right, bottom);
    if (!this.svg) return;
    const {
      TIME_TO_PLAY_ON_SCREEN,
      TIME_ELAPSED_ON_SCREEN,
      MUSIC_PITCH_NUM
    } = this;
    const { clientWidth, clientHeight } = this.svg;
    const paddingTop = this.getViewStyle("paddingTop") || 0;
    const paddingBottom = this.getViewStyle("paddingBottom") || 0;
    // 单位毫秒时间长度总宽度除以屏幕总时间得到单位毫秒时间长度
    this.mUnitWidth =
      (this.svg?.clientWidth * 1.0) /
      (TIME_TO_PLAY_ON_SCREEN + TIME_ELAPSED_ON_SCREEN);
    // 音高线的高度，等于控件总高度，最后除以总的音阶数
    this.mRectHeight =
      (clientHeight - paddingTop - paddingBottom) / MUSIC_PITCH_NUM;
    //根据已唱时间和未唱时间，算出中间那根线的x坐标
    this.mMidX =
      (clientWidth * 1.0 * TIME_ELAPSED_ON_SCREEN) /
      (TIME_TO_PLAY_ON_SCREEN + TIME_ELAPSED_ON_SCREEN);
    //三角形默认y值处于音阶0点
    this.mMidY = this.getPitchTop(0);
    const halfHeight = (clientHeight - paddingTop - paddingBottom) / 2.0;
    this.mAnimHeight = Math.min(this.mAnimHeight, halfHeight);

    this.drawBackground();
  }

  private dispatchDraw(): void {
    //绘制标准音高线
    this.drawRect();
    //绘制击中音高线和其他效果
    this.drawHitRect();
    this.drawPitchPoint(); //绘制三角形
  }

  private drawBackground(): void {
    if (!this.svg || !this.svgBg) return;
    const { clientWidth, clientHeight } = this.svg;
    const num = this.MAX_BACKGROUND_LINE_NUM;
    const paddingTop = this.getViewStyle("paddingTop") || 0;
    const paddingBottom = this.getViewStyle("paddingBottom") || 0;
    const { mBackgroundLineHeight, mMidX, mTimeLineWidth } = this;
    const lineSpacing =
      (clientHeight -
        paddingTop -
        paddingBottom -
        num * mBackgroundLineHeight) /
      (num - 1.0);
    // 清空
    this.svgBg.innerHTML = "";

    // 绘制五线谱
    for (let i = 0; i < num; i++) {
      //mStaffPaint
      const line = document.createElementNS(SVG_URI, "line");
      line.setAttribute("x1", "0");
      line.setAttribute(
        "y1",
        i * (mBackgroundLineHeight + lineSpacing) + paddingBottom + ""
      );
      line.setAttribute("x2", clientWidth + "");
      line.setAttribute(
        "y2",
        i * (mBackgroundLineHeight + lineSpacing) +
        mBackgroundLineHeight +
        paddingBottom +
        ""
      );
      line.setAttribute("stroke", this.config.staffColor);
      line.setAttribute("stroke-width", "2");
      line.setAttribute("class", `zg-bg-line-${i}`);
      this.svgBg.appendChild(line);
    }

    //   mVerticalLinePaint
    const line = document.createElementNS(SVG_URI, "line");
    line.setAttribute("x1", mMidX + "");
    line.setAttribute("y1", paddingBottom + "");
    line.setAttribute("x2", mMidX + mTimeLineWidth + "");
    line.setAttribute("y2", clientHeight - paddingBottom + "");
    line.setAttribute("stroke", this.config.verticalLineColor);
    line.setAttribute("stroke-width", "2");
    line.setAttribute("class", `zg-veritical-line`);
    this.svgBg.appendChild(line);

    this.drawPitchPoint();
  }

  private drawRect(): void {
    const {
      mMusicPitchList,
      mStartTime,
      TIME_ELAPSED_ON_SCREEN,
      TIME_TO_PLAY_ON_SCREEN,
      mUnitWidth,
      mRectHeight
    } = this;
    if (!mMusicPitchList.length || !this.svgRect) {
      return;
    }
    // 音高线实际上就是一个个rect，计算出left, top, right, bottom执行drawRect绘制
    const startIndex = this.getCurrentMusicIndex(mMusicPitchList, mStartTime);
    let endIndex = this.getCurrentMusicIndex(
      mMusicPitchList,
      mStartTime + TIME_ELAPSED_ON_SCREEN + TIME_TO_PLAY_ON_SCREEN
    );

    if (startIndex == -1) {
      return;
    }

    if (endIndex == -1) {
      endIndex = mMusicPitchList.length - 1;
    }

    const showingPitchList = this.cutMusicPitch(
      mMusicPitchList,
      startIndex,
      endIndex + 1
    ).filter(item => item.pitch_value >= 0);
    const showingRectElements: SVGRectElement[] = [];
    for (const musicPitch of showingPitchList) {
      const left = (musicPitch.begin_time - mStartTime) * mUnitWidth;
      const right = left + musicPitch.duration * mUnitWidth;
      const width = musicPitch.duration * mUnitWidth;
      // 根据音高值确定top，先算出当前应该在第几个音阶，再乘以每阶高度
      const top = this.getPitchTop(musicPitch.pitch_value);
      // 音高线粗细
      // const bottom = top + mRectHeight;
      if (right >= left) {
        let rect = document.querySelector(
          `#${this.id} g .zg-rect-${Math.round(musicPitch.begin_time)}`
        ) as SVGRectElement;
        if (!rect) {
          rect = document.createElementNS(SVG_URI, "rect");
          rect.setAttribute("fill", this.config.standardPitchColor);
          rect.setAttribute("stroke", this.config.standardPitchColor);
          // rect.setAttribute('stroke-width', '2');
          rect.setAttribute(
            "class",
            `zg-rect zg-rect-${Math.round(musicPitch.begin_time)}`
          );
          rect.setAttribute("width", width + "");
          rect.setAttribute("height", mRectHeight + "");
          rect.setAttribute("rx", mRectHeight / 2 + "");
          rect.setAttribute("ry", mRectHeight / 2 + "");
          // rect.setAttribute('style', `transition: transform ${this.ESTIMATED_CALL_INTERVAL / 1e3}s linear;`);
          rect.setAttribute("x", left + "");
          rect.setAttribute("y", top + "");
        } else {
          rect.setAttribute("x", left + "");
        }

        this.svgRect.append(rect);
        showingRectElements.push(rect);
      }
    }

    // 移除已经不展示的RECT元素
    const existRectElements = Array.from(
      document.querySelectorAll(`#${this.id} g .zg-rect`)
    ) as SVGRectElement[];
    existRectElements.forEach(item => {
      if (!showingRectElements.includes(item)) {
        this.svgRect.removeChild(item);
      }
    });
  }

  private drawHitRect(): void {
    //与drawRect逻辑类似，使用mHitRectList里的数据画出击中的音高线
    const {
      mHitRectList,
      mStartTime,
      TIME_ELAPSED_ON_SCREEN,
      TIME_TO_PLAY_ON_SCREEN,
      mUnitWidth,
      mRectHeight
    } = this;
    if (!mHitRectList.length) {
      return;
    }

    const startIndex = this.getCurrentMusicIndex(mHitRectList, mStartTime);
    let endIndex = this.getCurrentMusicIndex(
      mHitRectList,
      mStartTime + TIME_ELAPSED_ON_SCREEN + TIME_TO_PLAY_ON_SCREEN
    );

    if (startIndex == -1) {
      return;
    }

    if (endIndex == -1) {
      endIndex = mHitRectList.length - 1;
    }

    const showingPitchList = this.cutMusicPitch(
      mHitRectList,
      startIndex,
      endIndex + 1
    ).filter(item => item.pitch_value >= 0);
    // console.warn("showingPitchList", JSON.stringify(showingPitchList))
    const showingRectElements: SVGRectElement[] = [];
    for (const musicPitch of showingPitchList) {
      const left = (musicPitch.begin_time - mStartTime) * mUnitWidth;
      const right = left + musicPitch.duration * mUnitWidth;
      const width = musicPitch.duration * mUnitWidth;
      // 根据音高值确定top，先算出当前应该在第几个音阶，再乘以每阶高度
      const top = this.getPitchTop(musicPitch.pitch_value);
      // 音高线粗细
      // const bottom = top + mRectHeight;
      if (right >= left) {
        let rect = document.querySelector(
          `#${this.id} g .zg-hit-rect-${Math.round(musicPitch.begin_time)}`
        ) as SVGRectElement;
        if (!rect) {
          rect = document.createElementNS(SVG_URI, "rect");
          rect.setAttribute("fill", this.config.hitPitchColor);
          rect.setAttribute("stroke", this.config.hitPitchColor);
          // rect.setAttribute('stroke-width', '2');
          rect.setAttribute(
            "class",
            `zg-hit-rect zg-hit-rect-${Math.round(musicPitch.begin_time)}`
          );
          rect.setAttribute("width", width + "");
          rect.setAttribute("height", mRectHeight + "");
          rect.setAttribute("rx", mRectHeight / 2 + "");
          rect.setAttribute("ry", mRectHeight / 2 + "");
          // rect.setAttribute('style', `transition: transform ${this.ESTIMATED_CALL_INTERVAL / 1e3}s linear;`);
          rect.setAttribute("x", left + "");
          rect.setAttribute("y", top + "");
        } else {
          rect.setAttribute("x", left + "");
          rect.setAttribute("width", width + ""); // 高亮音高线长度会变化
        }

        this.svgHitRect.append(rect);
        showingRectElements.push(rect);
      }
    }
    // 移除已经不展示的RECT元素
    const existRectElements = Array.from(
      document.querySelectorAll(`#${this.id} g .zg-hit-rect`)
    ) as SVGRectElement[];
    existRectElements.forEach(item => {
      if (!showingRectElements.includes(item)) {
        this.svgHitRect.removeChild(item);
      }
    });
  }

  /**
   * 裁切索引范围内的
   * @param pitchList
   * @param statIndex
   * @param endIndex
   * @returns
   */
  private cutMusicPitch(
    pitchList: ZegoPitch[],
    statIndex: number,
    endIndex: number
  ): ZegoPitch[] {
    const temp: ZegoPitch[] = [];
    const size = pitchList.length;
    if (size < 1) {
      return temp;
    }
    if (endIndex >= size) {
      endIndex = size - 1;
    }
    return pitchList.slice(statIndex, endIndex + 1).map(item => ({ ...item }));
  }

  private getCurrentMusicIndex(pitchList: ZegoPitch[], time: number): number {
    const size = pitchList.length;

    for (let i = 0; i < size; i++) {
      const pitch = pitchList[i];
      const picthEndTime = pitch.begin_time + pitch.duration;
      if (time <= picthEndTime && pitch.pitch_value !== -1) {
        return i;
      }
    }
    return -1;
  }

  private drawPitchPoint(): void {
    // 画当前音高值，此处是用一个三角形图标表示当前高音值位置
    const {
      TRIANGLE_WIDTH,
      TRIANGLE_HEIGHT,
      mMidX,
      mMidY,
      ANIM_TOTAL_TIME,
      mScoreOffsetX,
      mScoreOffsetY
    } = this;

    const pathStr = `M ${mMidX - TRIANGLE_WIDTH},${0 -
      TRIANGLE_HEIGHT / 2} L ${mMidX},${0} L ${mMidX - TRIANGLE_WIDTH},${0 +
      TRIANGLE_HEIGHT / 2} Z`;

    const point = document.querySelector(
      `#${this.id} g .zg-pitch-point`
    ) as SVGPathElement;
    if (!point) {
      const point = document.createElementNS(SVG_URI, "path");
      point.setAttribute("d", pathStr);
      point.setAttribute("fill", this.config.pitchIndicatorColor);
      point.setAttribute("stroke", this.config.pitchIndicatorColor);
      point.setAttribute("stroke-width", "2");
      point.setAttribute("class", "zg-pitch-point");
      point.setAttribute(
        "style",
        `transition: transform ${this.ESTIMATED_CALL_INTERVAL / 1e3}s linear;`
      );
      this.svgPoint.appendChild(point);
      point.setAttribute("transform", `translate(0, ${mMidY})`);
    } else {
      point.setAttribute("transform", `translate(0, ${mMidY})`);
    }

    const time = Date.now();
    [...this.scoreList].forEach(score => {
      let svgScore = document.querySelector(
        `#${this.id} g .zg-score-text`
      ) as SVGTextElement;
      if (time - score.startTime > ANIM_TOTAL_TIME) {
        const curIndex = this.scoreList.indexOf(score);
        this.scoreList.splice(curIndex, 1);
        if (svgScore) {
          svgScore.setAttribute("opacity", "0");
        }
      } else {
        const text = "+" + score.score;
        const opacity = this.getOpacity(time - score.startTime) + "";
        // console.warn('drawScore', score.score, opacity)

        if (!svgScore) {
          svgScore = document.createElementNS(SVG_URI, "text");
          svgScore.setAttribute("font-size", "24");
          svgScore.setAttribute("fill", this.config.scoreTextColor);
          svgScore.setAttribute("class", "zg-score-text");
          this.svgPoint.appendChild(svgScore);
        }
        svgScore.setAttribute("opacity", opacity);
        svgScore.textContent = text;
        const bbox = svgScore.getBBox();
        const textHeight = bbox.height;
        const textWidth = bbox.width;
        const top = score.top + mScoreOffsetY + textHeight / 2;
        // TODO: 上升动画进度为匀速，非自然运动
        const animProcess = (time - score.startTime) / 200;
        if (mScoreOffsetX < 0) {
          svgScore.setAttribute(
            "x",
            mMidX + mScoreOffsetX - textWidth + 4 + ""
          );
          svgScore.setAttribute(
            "y",
            top + (mMidY - top) * (animProcess > 1 ? 1 : animProcess) + ""
          );
        } else {
          svgScore.setAttribute("x", mMidX + mScoreOffsetX + 4 + "");
          svgScore.setAttribute(
            "y",
            top + (mMidY - top) * (animProcess > 1 ? 1 : animProcess) + ""
          );
        }
      }
    });
  }

  private getCurrentMusicList(
    pitchList: ZegoPitch[],
    startTime: number,
    duration: number
  ): number[] {
    const size = pitchList.length;
    const currentMusicList: number[] = [];

    for (let i = 0; i < size; i++) {
      const pitch = pitchList[i];
      const pitchStartTime = pitch.begin_time;
      const picthEndTime = pitch.begin_time + pitch.duration;
      if (startTime + duration < pitchStartTime) {
        break;
      }

      // || (startTime + duration) <= picthEndTime
      if (startTime <= picthEndTime) {
        currentMusicList.push(i);
      }
    }

    return currentMusicList;
  }

  private addHitRectList(pitch: ZegoPitch): void {
    if (pitch === null) {
      return;
    }

    if (this.mHitRectList.length === 0) {
      this.mHitRectList.push(pitch);
      return;
    }

    const position = this.binarySearch(this.mHitRectList, pitch.begin_time);
    // console.log("addHitRectList binarySearch", position, pitch.begin_time)
    if (position === -1) {
      const endPitch = this.mHitRectList[this.mHitRectList.length - 1];
      if (endPitch.begin_time + endPitch.duration + 1 < pitch.begin_time) {
        this.mHitRectList.push(pitch);
      } else {
        // debugger
        const size = this.mHitRectList.length;
        for (let i = 0; i < size - 1; i++) {
          if (this.mHitRectList[i].begin_time > pitch.begin_time) {
            this.mHitRectList.splice(i, 0, pitch);
            break;
          }
        }
      }
    } else {
      const positionPitch = this.mHitRectList[position];
      if (positionPitch.pitch_value === pitch.pitch_value) {
        positionPitch.duration =
          pitch.begin_time + pitch.duration - positionPitch.begin_time;
      } else {
        this.mHitRectList.splice(position + 1, 0, pitch);
      }
    }
    // console.warn(`addHitRectList`, JSON.stringify(this.mHitRectList))
  }
  binarySearch(pitchList: ZegoPitch[], key: number): number {
    let low = 0;
    let high = pitchList.length - 1;
    while (low <= high) {
      const mid = Math.floor((high + low) / 2);
      const temp = pitchList[mid];
      if (key > temp.begin_time + temp.duration + 1) {
        low = mid + 1;
      } else if (key < temp.begin_time) {
        high = mid - 1;
      } else {
        return mid;
      }
    }
    return -1;
  }

  getOpacity(time: number): number {
    const { ANIM_TOTAL_TIME, ANIM_START_TIME, ANIM_END_TIME } = this;
    const startEndTime = ANIM_TOTAL_TIME - ANIM_END_TIME;
    let percent = 0;
    if (time > startEndTime) {
      percent = Math.round((1 - (time - startEndTime) / ANIM_END_TIME) * 100);
    } else if (time > ANIM_START_TIME) {
      percent = 100;
    } else {
      percent = Math.round((time / ANIM_START_TIME) * 100);
    }
    return percent / 100;
  }
}

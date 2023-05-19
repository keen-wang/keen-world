interface ZegoPitch {
  begin_time: number;
  duration: number;
  pitch_value: number;
}
const SVG_URI = 'http://www.w3.org/2000/svg'
export class ZegoPitchView {
  MAX_BACKGROUND_LINE_NUM = 5; // 最大背景线数量
  MUSIC_PITCH_NUM = 20; // 音阶数，可自行定义
  MUSIC_MAX_PITCH = 90; // 最大音高值,不可更改
  MUSIC_MIN_PITCH = 10; // 最小音高值，不可更改
  TIME_ELAPSED_ON_SCREEN = 1150; // 屏幕中已经唱过的时间（控件开始至竖线这一段表示的时间），可自行定义
  TIME_TO_PLAY_ON_SCREEN = 2750; // 屏幕中还未唱的时间（竖线至控件末尾这一段表示的时间），可自行定义

  ESTIMATED_CALL_INTERVAL = 60; // 击中块时间间隔(调用 setCurrentSongProgress 方法的大致时间间隔)
  ESTIMATED_CALL_INTERVAL_OFFSET = this.ESTIMATED_CALL_INTERVAL / 2; // 击中块时间间隔偏移

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
  TRIANGLE_WIDTH: number = 10;
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
  mMidX = 0; //当前高音值三角形的x坐标

  mMidY = 0; //当前高音值三角形的y坐标
  mMusicPitchList: ZegoPitch[] = []; //全部音高数据
  mHitRectList: ZegoPitch[] = []; //击中音高数据
  mCurrentMusicPitch = 0; //当前音高值，用于绘制三角指针的高度位置
  mCurrentSongTime = 0; //当前歌曲时间戳

  // // TODO: 可能用不上 Paint 类型
  // mStandardPitchPaint;
  // mHitPitchPaint;
  // mStaffPaint;
  // mVerticalLinePaint;
  // mTrianglePaint;
  // mScorePaint;

  // ？？？？
  // pathInterpolator = new PathInterpolator(0.5, 0.5, 0.5, 0.5);
  mScoreOffsetY = 0;
  mScoreOffsetX = 0;
  mAnimHeight = 0;

  scoreList: any = [];
  svg: SVGSVGElement;
  svgBg: SVGGElement;
  svgRect: SVGGElement;
  container: HTMLElement | null = null
  /**
   * UI config
   *
   */
  config = {
    standardPitchColor: "#FF5D3B94", //默认音高线颜色
    hitPitchColor: "#FF3751", // 击中音高线颜色
    pitchIndicatorColor: "#FFFFFF", // 音调指示器颜色
    staffColor: "#33FFFFFF", //五线谱横线颜色
    verticalLineColor: "#FFA87BF1", //竖线颜色
    scoreTextColor: "#fff" //分数文本颜色
  };

  //根据当前时间找到对应的音高线数据
  get currentMusicIndex(): number {
    const index = this.mMusicPitchList.findIndex((item, index) => {
      const nextItem = this.mMusicPitchList[index + 1];
      if (
        this.mCurrentSongTime >= item.begin_time &&
        this.mCurrentSongTime < item.begin_time
      ) {
        return true;
      } else if (!nextItem) {
        return true;
      } else {
        return false;
      }
    });
    return isNaN(index) ? -1 : index;
  }

  constructor() {
    const svg = this.svg = document.createElementNS(SVG_URI, 'svg');
    svg.setAttribute('id', 'pitchView');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    const bg = this.svgBg = document.createElementNS(SVG_URI, 'g');
    svg.appendChild(bg);

    const svgRect = this.svgRect = document.createElementNS(SVG_URI, 'g');
    svg.appendChild(svgRect);
  }

  mount(
    container: HTMLElement | string,
    config?: any
  ): void {
    if (typeof container === "string") {
      container = document.getElementById(container) as any;
    }
    if (container) {
      this.container = container as HTMLElement;
      this.container.append(this.svg);
    } else {
      throw "container not found";
    }
    // 计算布局
    this.onLayout()
  }

  /**
   * 传入音高线数组
   */
  public setStandardPitch(pitchList: ZegoPitch[]): void {
    this.mMusicPitchList = [...pitchList];
  }

  /**
   * 设置当前播放时间和音阶，两个参数必须同时设置，保证数据同步性
   *
   * @param progress 当前播放时间
   * @param pitch 实时音高
   */
  public setCurrentSongProgress(progress: number, pitch: number): void {
    console.warn("setCurrentSongProgress", progress, pitch)
    this.mStartTime = progress - this.TIME_ELAPSED_ON_SCREEN;
    this.mCurrentSongTime = progress;
    this.mCurrentMusicPitch = pitch;
    // const indexList = this.getCurrentMusicList(this.mMusicPitchList, this.mCurrentSongTime - this.ESTIMATED_CALL_INTERVAL - this.ESTIMATED_CALL_INTERVAL_OFFSET, this.ESTIMATED_CALL_INTERVAL + this.ESTIMATED_CALL_INTERVAL_OFFSET);
    let offsetPitch = -1;

    if (this.currentMusicIndex >= 0) {
      //能够找到索引,有音高对应的情况
      offsetPitch = this.getOffsetPitch(pitch);
      if (offsetPitch === -1) {
        this.mCurrentMusicPitch = 0; //无声情况
      } else {
        const musicPitch = this.mMusicPitchList[this.currentMusicIndex];
        if (musicPitch) {
          this.mCurrentMusicPitch = musicPitch.pitch_value + offsetPitch * 4;
          if (offsetPitch === 0) {
            const hitStartTime = Math.max(
              musicPitch.begin_time,
              this.mCurrentSongTime -
              this.ESTIMATED_CALL_INTERVAL -
              this.ESTIMATED_CALL_INTERVAL_OFFSET
            );
            const hitEndTime = Math.min(
              musicPitch.begin_time + musicPitch.duration,
              this.mCurrentSongTime
            );
            if (hitEndTime - hitStartTime !== 0) {
              this.mHitRectList.push({
                duration: hitEndTime - hitStartTime,
                pitch_value: musicPitch.pitch_value,
                begin_time: hitStartTime
              });
            }
          }
        }
      }
    } else {
      this.mCurrentMusicPitch = pitch;
    }
    this.drawRect()
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
  public setUIConfig(config: any): void {
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
  onLayout(): // changed: boolean,
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

    this.drawBackground()
  }

  // private dispatchDraw(): void {
  //   this.drawBackground();
  //   //绘制标准音高线
  //   this.drawRect();
  //   //绘制击中音高线和其他效果
  //   this.drawHitRect();
  //   this.drawPitchPoint(); //绘制三角形
  // }

  private drawBackground(): void {
    if (!this.svg || !this.svgBg) return;
    const { clientWidth, clientHeight } = this.svg;
    const num = this.MAX_BACKGROUND_LINE_NUM;
    const paddingTop = this.getViewStyle("paddingTop") || 0;
    const paddingBottom = this.getViewStyle("paddingBottom") || 0;
    const {
      mBackgroundLineHeight,
      mMidX,
      mTimeLineWidth,
    } = this;
    const lineSpacing =
      (clientHeight -
        paddingTop -
        paddingBottom -
        num * mBackgroundLineHeight) /
      (num - 1.0);
    // 清空
    this.svgBg.innerHTML = ""

    // 绘制五线谱
    for (let i = 0; i < num; i++) {
      //mStaffPaint
      const line = document.createElementNS(SVG_URI, 'line');
      line.setAttribute('x1', '0');
      line.setAttribute('y1', (i * (mBackgroundLineHeight + lineSpacing) + paddingBottom) + "");
      line.setAttribute('x2', clientWidth + '');
      line.setAttribute('y2', i * (mBackgroundLineHeight + lineSpacing) +
        mBackgroundLineHeight +
        paddingBottom + "");
      line.setAttribute('stroke', this.config.staffColor);
      line.setAttribute('stroke-width', '2');
      line.setAttribute('class', `zg-bg_line-${i}`);
      this.svgBg.appendChild(line)

    }

    // canvas.drawLine(
    //   mMidX,
    //   paddingBottom,
    //   mMidX + mTimeLineWidth,
    //   clientHeight - paddingBottom,
    // );

    //   mVerticalLinePaint
    const line = document.createElementNS(SVG_URI, 'line');
    line.setAttribute('x1', mMidX + '');
    line.setAttribute('y1', paddingBottom + "");
    line.setAttribute('x2', mMidX + mTimeLineWidth + '');
    line.setAttribute('y2', clientHeight - paddingBottom + "");
    line.setAttribute('stroke', this.config.verticalLineColor);
    line.setAttribute('stroke-width', '2');
    line.setAttribute('class', `zg-veritical_line`);
    this.svgBg.appendChild(line)
  }

  drawRect(): void {
    const {
      mMusicPitchList,
      mStartTime,
      TIME_ELAPSED_ON_SCREEN,
      TIME_TO_PLAY_ON_SCREEN,
      mUnitWidth,
      mRectHeight,

    } = this;
    if (!mMusicPitchList.length || !this.svgRect) {
      return;
    }
    this.svgRect.innerHTML = ""
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

    const showingPitchList = this.cutMusicPitch(mMusicPitchList, startIndex, endIndex + 1);
    for (const musicPitch of showingPitchList) {

      const left = (musicPitch.begin_time - mStartTime) * mUnitWidth;
      const right = left + musicPitch.duration * mUnitWidth;
      const width = musicPitch.duration * mUnitWidth;
      // 根据音高值确定top，先算出当前应该在第几个音阶，再乘以每阶高度
      const top = this.getPitchTop(musicPitch.pitch_value);
      if (top > 200) {
        debugger
      }
      // 音高线粗细
      const bottom = top + mRectHeight;
      if (right >= left) {
        // 用自定义的画笔绘制
        // canvas.drawRoundRect(
        //   left,
        //   top,
        //   right,
        //   bottom,
        //   mRectHeight / 2.0,
        //   mRectHeight / 2.0,
        //   mStandardPitchPaint
        // );
        // canvas.drawRect(left, top, right, bottom, mMusicPitchPaint);
        // 
        const rect = document.createElementNS(SVG_URI, 'rect');
        rect.setAttribute('x', left + '');
        rect.setAttribute('y', top + '');
        rect.setAttribute('width', width + '');
        rect.setAttribute('height', mRectHeight + '');
        rect.setAttribute('rx', mRectHeight / 2 + '');
        rect.setAttribute('ry', mRectHeight / 2 + '');
        rect.setAttribute('fill', 'none');
        rect.setAttribute('stroke', `#000`);
        rect.setAttribute('stroke-width', '2');
        rect.setAttribute('class', `zg-rect-${musicPitch.begin_time}`);
        this.svgRect.append(rect)
      }
    }
  }

  drawHitRect(): void {
    //与drawRect逻辑类似，使用mHitRectList里的数据画出击中的音高线
    const {
      mHitRectList,
      mStartTime,
      TIME_ELAPSED_ON_SCREEN,
      TIME_TO_PLAY_ON_SCREEN,
      mUnitWidth,
      mRectHeight,

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

    const data = this.cutMusicPitch(mHitRectList, startIndex, endIndex + 1);
    for (const musicPitch of data) {
      const left = (musicPitch.begin_time - mStartTime) * mUnitWidth;
      const right = left + musicPitch.duration * mUnitWidth;
      // 根据音高值确定top，先算出当前应该在第几个音阶，再乘以每阶高度
      const top = this.getPitchTop(musicPitch.pitch_value);
      // 音高线粗细
      const bottom = top + mRectHeight;
      if (right >= left) {
        // 用自定义的画笔绘制
        // canvas.drawRoundRect(
        //   left,
        //   top,
        //   right,
        //   bottom,
        //   mRectHeight / 2.0,
        //   mRectHeight / 2.0,
        //   mHitPitchPaint
        // );
        // canvas.drawRect(left, top, right, bottom, mHitPitchPaint);
      }
    }
  }

  /**
   * 裁切索引范围内的
   * @param pitchList
   * @param statIndex
   * @param endIndex
   * @returns
   */
  cutMusicPitch(
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
    // for (let i = statIndex; i < size && i <= endIndex; i++) {
    //   const pitch = pitchList[i];

    //   if (pitch == null) {
    //     continue;
    //   }

    //   temp.push({
    //     ...pitch
    //   });
    // }

    // return temp;
  }

  getCurrentMusicIndex(pitchList: ZegoPitch[], time: number): number {
    const size = pitchList.length;

    for (let i = 0; i < size; i++) {
      const pitch = pitchList[i];
      if (time <= pitch.begin_time + pitch.duration) {
        return i;
      }
    }
    return -1;
  }

  drawPitchPoint() {
    // 画当前音高值，此处是用一个三角形图标表示当前高音值位置
    const {
      TRIANGLE_WIDTH,
      TRIANGLE_HEIGHT,
      mMidX,
      mMidY,
      ANIM_TOTAL_TIME,
      mScoreOffsetX
    } = this;
    // const path = new Path();
    // path.moveTo(mMidX - TRIANGLE_WIDTH, mMidY - TRIANGLE_HEIGHT / 2);
    // path.lineTo(mMidX, mMidY);
    // path.lineTo(mMidX - TRIANGLE_WIDTH, mMidY + TRIANGLE_HEIGHT / 2);
    // path.close();
    // canvas.drawPath(path, mTrianglePaint);

    const time = Date.now();
    [...this.scoreList].forEach(item => {
      const score = item;
      if (time - score.getStartTime() > ANIM_TOTAL_TIME) {
        const curIndex = this.scoreList.indexOf(item);
        this.scoreList.splice(curIndex, 1);
      } else {
        // mScorePaint.setAlpha(getAlpha(time - score.getStartTime()));
        // const text = "+" + score.getScore();
        // const textWidth = mScorePaint.measureText(text);
        // const lineBound = new Rect();
        // mScorePaint.getTextBounds(text, 0, text.length(), lineBound);
        // const textHeight = lineBound.height();
        // if (mScoreOffsetX < 0) {
        //   canvas.drawText(text, mMidX + mScoreOffsetX - textWidth, getTop(score.getTop() + mScoreOffsetY + textHeight / 2, time - score.getStartTime())), mScorePaint);
        // } else {
        //   canvas.drawText(text, mMidX + mScoreOffsetX, getTop(score.getTop() + mScoreOffsetY + textHeight / 2, time - score.getStartTime()), mScorePaint);
        // }
      }
    });
  }

  // render() {}
}

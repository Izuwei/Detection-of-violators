# Author: Jakub Sadilek
#
# Faculty of Information Technology
# Brno University of Technology
# 2022

import os
import sys
import argparse


def argumentParser():
    """
    Function parse and check program arguments and returns an object of class ArgumentParser.
    """

    parser = argparse.ArgumentParser(
        description="Detection and analysis of objects in video sequence."
    )

    parser.add_argument(
        "-i",
        "--input",
        type=str,
        required=True,
        metavar="FILE_PATH",
        help="Path to the video file.",
    )
    parser.add_argument(
        "-n",
        "--name",
        type=str,
        default="processed",
        required=False,
        metavar="FILENAME",
        help="The name of the output file.",
    )
    parser.add_argument(
        "-d",
        "--database",
        type=str,
        default="database",
        required=False,
        metavar="PATH_TO_DB",
        help="Path to the face database.",
    )
    parser.add_argument(
        "-m",
        "--model",
        type=str,
        default="yolo320",
        choices=["yolo320", "yolo608"],
        required=False,
        metavar="MODEL",
        help="Defines a model for object detection. (default: yolo320)",
    )
    parser.add_argument(
        "-a",
        "--area",
        type=int,
        nargs=4,
        required=False,
        metavar="INTEGER",
        help="Defines a detection area as [x, y, width, height]. (default: fullscreen)",
    )
    parser.add_argument(
        "-l",
        "--traillen",
        type=float,
        default=1.5,
        required=False,
        metavar="FLOAT",
        help="Sets path length of the tracked object in seconds. (require '-t' and '-p', default: 1.5)",
    )
    parser.add_argument(
        "-o",
        "--output",
        default=".",
        required=False,
        metavar="PATH",
        help="Sets path for the output. (default: .)",
    )
    parser.add_argument(
        "-w",
        "--weights",
        default="yolov3/yolov3.weights",  #  Pretrained weights
        required=False,
        metavar="PATH",
        help="Path to YOLOv3 weights. (default: Default pretrained weights)",
    )
    parser.add_argument(
        "-v",
        "--cars",
        default=False,
        required=False,
        metavar="CARS",
        action=argparse.BooleanOptionalAction,
        help="Include cars into detected objects.",
    )
    parser.add_argument(
        "-f",
        "--frame",
        default=False,
        required=False,
        metavar="FRAME",
        action=argparse.BooleanOptionalAction,
        help="Draw a box around the detection area for its visibility. (require: '-a')",
    )
    parser.add_argument(
        "-r",
        "--recognition",
        default=False,
        required=False,
        metavar="RECOGNITION",
        action=argparse.BooleanOptionalAction,
        help="Set to recognize people by face.",
    )
    parser.add_argument(
        "-t",
        "--tracking",
        default=False,
        required=False,
        metavar="TRACKING",
        action=argparse.BooleanOptionalAction,
        help="Sets tracking of objects.",
    )
    parser.add_argument(
        "-p",
        "--paths",
        default=False,
        required=False,
        metavar="PATHS",
        action=argparse.BooleanOptionalAction,
        help="Set to draw paths of tracked objects. (require '-t')",
    )
    parser.add_argument(
        "-c",
        "--counter",
        default=False,
        required=False,
        metavar="COUNTER",
        action=argparse.BooleanOptionalAction,
        help="Set to display counters of tracked objects. (require '-t')",
    )
    parser.add_argument(
        "-s",
        "--timestamp",
        default=False,
        required=False,
        metavar="TIMESTAMP",
        action=argparse.BooleanOptionalAction,
        help="Set to display current timestamp.",
    )

    parser = parser.parse_args()

    # Check if input video file exists.
    if os.path.exists(parser.input) == False:
        sys.stderr.write("The input video file does not exist.\n")
        exit(1)

    # Check if file with weights exists.
    if os.path.exists(parser.weights) == False:
        sys.stderr.write("File with YOLOv3 weights does not exist.\n")
        exit(1)

    # Validity check of output path.
    if os.path.exists(parser.output) == False:
        sys.stderr.write("Specified output path does not exist.\n")
        exit(1)

    # Path for the output video file.
    parser.output = os.path.join(parser.output, parser.name)

    # Conversion of the detection area format from [x, y, w, h] to [x1, y1, x2, y2]
    if parser.area != None:
        parser.area[0] = abs(parser.area[0])
        parser.area[1] = abs(parser.area[1])
        parser.area[2] = abs(parser.area[2])
        parser.area[3] = abs(parser.area[3])
        parser.area[2] = parser.area[0] + parser.area[2]  # x2 = x1 + width
        parser.area[3] = parser.area[1] + parser.area[3]  # y2 = y1 + height

    return parser

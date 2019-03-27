/**
 * Copyright (C) 1972-2016 SAP Co., Ltd. All rights reserved.
 */
package com.sap.sme.common.stat;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sap.sme.common.logger.LightLogger;
import com.sap.sme.common.stat.model.FlowNode;
import com.sap.sme.common.stat.model.ParamList;
import com.sap.sme.common.stat.util.FlowStatUtils;

/**
 * @author I311334
 */
public class FlowStatisticsManager {

    private final LightLogger log = LightLogger.getLogger(this);

    private FlowNode rootNode = null;
    private FlowNode currentNode = null;

    private int index = 0;
    private Map<Integer, FlowNode> indexNodeMap = new HashMap<>();

    public int enter(String type, String name) {
        FlowNode node = new FlowNode(index++, type, name);
        node.enter();
        indexNodeMap.put(node.getIndex(), node);

        if (rootNode == null) {
            rootNode = node;
        } else {
            currentNode.child(node);
        }
        currentNode = node;

        return currentNode.getIndex();
    }

    public void exit(int index, String result) {
        if (rootNode == null) {
            log.warn("Error exist FlowStatistics node: flow not start.");
            return;
        }

        FlowNode node = indexNodeMap.get(index);
        if (node == null) {
            log.warn("Error exit FlowStatistics node: node of index[", index, "] not exist.");
            return;
        }

        if (node != currentNode) {
            log.warn("Warning exit FlowStatistics node: node of index[", index, "] is not current node.");
        }
        node.exit(result);

        if (node == rootNode) {
            currentNode = rootNode;
        } else {
            currentNode = node.getParent();
        }
    }

    public void reEnter(int index) {
        if (rootNode == null) {
            log.warn("Error reEnter FlowStatistics node: flow not start.");
            return;
        }

        FlowNode node = indexNodeMap.get(index);
        if (node == null) {
            log.warn("Error reEnter FlowStatistics node: node of index[", index, "] not exist.");
            return;
        }

        node.enter();
    }

    public void reExit(int index, String result) {
        if (rootNode == null) {
            log.warn("Error reExit FlowStatistics node: flow not start.");
            return;
        }

        FlowNode node = indexNodeMap.get(index);
        if (node == null) {
            log.warn("Error reExit FlowStatistics node: node of index[", index, "] not exist.");
            return;
        }

        node.exit(result);
    }

    public void param(int index, String key, Object value) {
        if (rootNode == null) {
            log.warn("Error update param of FlowStatistics node: flow not start.");
            return;
        }

        FlowNode node = indexNodeMap.get(index);
        if (node == null) {
            log.warn("Error update param of FlowStatistics node: node of index[", index, "] not exist.");
            return;
        }

        node.param(key, value);
    }

    public boolean isRootIndex(int index) {
        if (rootNode == null) {
            log.warn("Error check root index of FlowStatistics node: flow not start.");
            return false;
        }

        FlowNode node = indexNodeMap.get(index);
        if (node == null) {
            log.warn("Error check root index of FlowStatistics node: node of index[", index, "] not exist.");
            return false;
        }

        return node == rootNode;
    }

    public long getExecuteTime(int index) {
        if (rootNode == null) {
            log.warn("Error get param of FlowStatistics node: flow not start.");
            return -1;
        }

        FlowNode node = indexNodeMap.get(index);
        if (node == null) {
            log.warn("Error get param of FlowStatistics node: node of index[", index, "] not exist.");
            return -1;
        }

        return node.getExecuteTime();
    }

    public long getTotalTime(int index) {
        if (rootNode == null) {
            log.warn("Error get param of FlowStatistics node: flow not start.");
            return -1;
        }

        FlowNode node = indexNodeMap.get(index);
        if (node == null) {
            log.warn("Error get param of FlowStatistics node: node of index[", index, "] not exist.");
            return -1;
        }

        return node.getTotalTime();
    }

    public void logStatistics() {
        if (rootNode == null) {
            log.warn("Error log FlowStatistics: flow not start.");
            return;
        } else if (currentNode != rootNode) {
            log.warn("Warning log FlowStatistics node: flow not end.");
        }

        Map<String, Long> statMap = new HashMap<>();

        StringBuilder buf = new StringBuilder();
        buf.append("\n");
        buf.append("-------------------- flow statistics start --------------------\n");
        recursiveGenLog(buf, rootNode, statMap);
        genExecTimeTotal(buf, statMap);
        buf.append("-------------------- flow statistics end   --------------------");

        log.info(buf.toString());
    }

    public void clear() {
        if (rootNode != null) {
            rootNode.clear();
        }
        rootNode = null;
        currentNode = null;
        index = 0;
        indexNodeMap.clear();
    }

    private void recursiveGenLog(StringBuilder buf, FlowNode node, Map<String, Long> statMap) {
        if (node.isLeaf()) {
            String type = node.getType();

            String execCountKey = type + " Count";
            Long execCount = statMap.get(execCountKey);
            if (execCount == null) {
                execCount = 1L;
            } else {
                execCount = execCount + 1;
            }
            statMap.put(execCountKey, execCount);

            String execTimeKey = type + " Time";
            Long execTime = statMap.get(execTimeKey);
            if (execTime == null) {
                execTime = node.getExecuteTime();
            } else {
                execTime = execTime + node.getExecuteTime();
            }
            statMap.put(execTimeKey, execTime);
        }

        ParamList paramList = new ParamList();
        if (node.getLevel() > 0) {
            paramList.addSplit();
        }
        node.addTo(paramList);
        paramList.genLog(buf, node.getLevel());

        for (FlowNode child : node.getChildList()) {
            recursiveGenLog(buf, child, statMap);
        }
    }

    private void genExecTimeTotal(StringBuilder buf, Map<String, Long> execTimeMap) {
        long leafTotalTime = 0;
        for (Map.Entry<String, Long> entry : execTimeMap.entrySet()) {
            if (entry.getKey().endsWith(" Time")) {
                leafTotalTime += entry.getValue();
            }
        }

        ParamList paramList = new ParamList();
        paramList.addSplit();
        paramList.add("Flow Time", rootNode.genExecuteTime());
        paramList.add("Local Time", FlowStatUtils.formatTime(rootNode.getExecuteTime() - leafTotalTime));

        List<String> typeList = new ArrayList<>(execTimeMap.keySet());
        Collections.sort(typeList);
        for (String type : typeList) {
            paramList.add(type, type.endsWith(" Time") ? FlowStatUtils.formatTime(execTimeMap.get(type)) : execTimeMap.get(type));
        }

        paramList.genLog(buf, 0);
    }

    /* (non-Javadoc)
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        return "FlowStatisticsManager [rootNode="
                + rootNode
                + ", currentNode="
                + ((currentNode != null) ? currentNode.getIndex() : null)
                + ", index="
                + index
                + "]";
    }

}

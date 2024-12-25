import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Card, CardHeader, CardBody, Table } from 'reactstrap';
import axiosInstance from '../../../api/axiosInstance';

const TaskHistoryModal = ({ isOpen, onRequestClose, taskPkNum }) => {
  const [taskHistory, setTaskHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchTaskHistory();
    }
  }, [isOpen, taskPkNum]);

  const fetchTaskHistory = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/board/task/history/${taskPkNum}`);
      setTaskHistory(response.data);
    } catch (error) {
      console.error('태스크 수정 이력을 불러오는 데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR');
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="태스크 수정 이력"
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxHeight: '80%',
        },
      }}
    >
      <Card style={{ height: "auto", overflowY: "auto" }}>
        <CardHeader>
          <h2>태스크 수정 이력</h2>
          <button className="btn btn-secondary" onClick={onRequestClose}>닫기</button>
        </CardHeader>
        <CardBody style={{ fontSize: "1.2rem", padding: "0" }}>
          {loading ? (
            <p className="text-center">로딩 중...</p>
          ) : taskHistory.length === 0 ? (
              <p className="text-center font-weight-bold pt-3">수정 이력이 없습니다.</p>
          ) : (
            <Table responsive style={{ fontSize: "1.2rem" }}>
              <thead>
                <tr>
                  <th>수정 일시</th>
                  <th>수정자</th>
                  <th>수정 항목</th>
                  <th>이전 값</th>
                  <th>변경 값</th>
                </tr>
              </thead>
              <tbody>
                {taskHistory.map((history, index) => (
                  <tr key={index}>
                    <td>{formatDate(history.taskhisUpdated)}</td>
                    <td>{history.userName}</td>
                    <td>{history.taskhisType}</td>
                    <td>{history.taskhisBeforevalue}</td>
                    <td>{history.taskhisAftervalue}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>
    </Modal>
  );
};

export default TaskHistoryModal;
